import { useEffect, useRef } from 'react'
import { SCENE_H, SCENE_W } from '@/data/hotspots'

/**
 * Animación de video sobre la escena, con transparencia.
 * El MP4 trae dos mitades: arriba el color y abajo el alfa (qué partes se ven).
 * Se dibuja con WebGL en un canvas propio: el video lo decodifica la placa, así va fluido
 * a su velocidad real y solo se ve lo que se mueve (el resto sigue siendo la foto nítida).
 *
 * pingpong: el video tiene la ida y la vuelta (capó). Al soltar, vuelve desde donde esté.
 * once: se reproduce entero una vez (mate, hoja) aunque se saque el mouse; al terminar
 *       queda quieto y, cuando el mouse ya no está, se funde suave a la foto.
 */
export interface Clip {
  /** ruta sin extensión: hay .webm (VP9, más liviano) y .mp4 (H.264, para Safari) */
  src: string
  /** posición y tamaño en coordenadas de la escena (1677 x 938) */
  x: number
  y: number
  w: number
  h: number
  /** tamaño en píxeles de cada mitad del video */
  pw: number
  ph: number
  /** cuadros de la ida y cuadros por segundo */
  frames: number
  fps: number
}

function pickSrc(base: string) {
  const ua = navigator.userAgent
  const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua)
  const probe = document.createElement('video')
  if (!safari && probe.canPlayType('video/webm; codecs="vp9"')) return `${base}.webm`
  return `${base}.mp4`
}

const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`
const FS = `precision mediump float;varying vec2 uv;uniform sampler2D t;uniform float o;uniform float e;
void main(){vec3 c=texture2D(t,vec2(uv.x,min(uv.y*.5,.5-e))).rgb;float a=texture2D(t,vec2(uv.x,max(.5+uv.y*.5,.5+e))).r;
a=clamp((a-.02)/.96,0.,1.)*o;gl_FragColor=vec4(c*a,a);}`

export function VideoSprite({
  clip,
  active,
  mode,
  loadDelay = 0,
}: {
  clip: Clip
  active: boolean
  mode: 'pingpong' | 'once'
  loadDelay?: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const api = useRef<{ set: (on: boolean) => void } | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const wrap = wrapRef.current!
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false })
    if (!gl) return
    let alive = true

    // ---- WebGL
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const uO = gl.getUniformLocation(prog, 'o')
    const uE = gl.getUniformLocation(prog, 'e')
    gl.uniform1f(uE, 1 / (clip.ph * 2))

    // ---- Video
    const v = document.createElement('video')
    v.muted = true
    v.playsInline = true
    v.setAttribute('playsinline', '')
    v.preload = 'auto'
    v.crossOrigin = 'anonymous'
    let ready = false
    let texReady = false

    let opacity = 0 // opacidad general de la capa (para fundir al final en modo "once")
    let fadeTo = 0
    let fadeFrom = 0
    let fadeStart = 0
    let fadeDur = 0
    let raf = 0

    const T = (clip.frames - 1) / clip.fps // fin de la ida
    const total = (clip.frames * 2 - 2) / clip.fps // fin de la vuelta (pingpong)
    const frameOf = (t: number) => Math.round(t * clip.fps)
    let openTarget = false // pingpong: ¿hay que abrir?
    let state: 'idle' | 'playing' | 'holding' | 'fading' = 'idle'

    const draw = () => {
      if (!texReady) return
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      if (opacity <= 0.001) return
      gl.uniform1f(uO, opacity)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    const upload = () => {
      if (v.readyState < 2) return
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v)
      texReady = true
    }

    const tick = (now: number) => {
      raf = 0
      if (!alive) return
      if (fadeDur > 0) {
        const k = Math.min(1, (now - fadeStart) / fadeDur)
        opacity = fadeFrom + (fadeTo - fadeFrom) * (k * k * (3 - 2 * k))
        if (k >= 1) {
          fadeDur = 0
          if (state === 'fading' && opacity === 0) {
            state = 'idle'
            if (mode === 'once' && activeRef.current) start()
          }
        }
      }
      if (mode === 'pingpong' && !v.paused && openTarget && v.currentTime >= T - 0.5 / clip.fps) {
        // Llegó a abierto: quieto en el último cuadro de la ida
        v.pause()
      }
      upload()
      draw()
      if (!v.paused || fadeDur > 0) raf = requestAnimationFrame(tick)
    }
    const loop = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const fade = (to: number, ms: number) => {
      fadeFrom = opacity
      fadeTo = to
      fadeStart = performance.now()
      fadeDur = ms
      loop()
    }
    const playFrom = (t: number) => {
      v.currentTime = Math.max(0, t)
      const p = v.play()
      if (p) p.catch(() => undefined)
      loop()
    }

    const start = () => {
      state = 'playing'
      opacity = 1
      fadeDur = 0
      playFrom(0)
    }

    v.addEventListener('ended', () => {
      if (mode === 'once') {
        state = 'holding'
        if (!activeRef.current) {
          state = 'fading'
          fade(0, 650)
        }
      } else {
        // Terminó de cerrar
        opacity = 0
        draw()
      }
    })
    v.addEventListener('playing', loop)
    v.addEventListener('seeked', () => {
      upload()
      draw()
    })

    const set = (on: boolean) => {
      if (!ready) return
      if (mode === 'pingpong') {
        if (on === openTarget) return
        openTarget = on
        opacity = 1
        const f = frameOf(v.currentTime)
        if (on) {
          // Si estaba cerrando (segunda mitad), seguir desde el cuadro espejo de la ida
          const fwd = f >= clip.frames ? clip.frames * 2 - 2 - f : f
          if (fwd >= clip.frames - 1) return
          playFrom(fwd / clip.fps)
        } else {
          const fwd = f >= clip.frames ? clip.frames * 2 - 2 - f : f
          const back = clip.frames * 2 - 2 - fwd
          if (back >= clip.frames * 2 - 2) {
            opacity = 0
            draw()
            return
          }
          playFrom(Math.min(total, back / clip.fps))
        }
        return
      }
      // once
      if (on) {
        if (state === 'idle') start()
        else if (state === 'holding') {
          state = 'fading'
          fade(0, 220)
        }
      } else if (state === 'holding') {
        state = 'fading'
        fade(0, 650)
      }
    }
    api.current = { set }

    const t = setTimeout(() => {
      v.src = pickSrc(clip.src)
      v.load()
    }, loadDelay)
    v.addEventListener(
      'loadeddata',
      () => {
        if (!alive) return
        ready = true
        // Precalentar: subir el primer cuadro a la placa ahora (invisible)
        upload()
        draw()
        if (activeRef.current) set(true)
      },
      { once: true },
    )

    // ---- Ubicar el canvas igual que la escena (SVG "meet": entera y centrada)
    const place = () => {
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      const s = Math.min(W / SCENE_W, H / SCENE_H)
      const ox = (W - SCENE_W * s) / 2
      const oy = (H - SCENE_H * s) / 2
      const cssW = clip.w * s
      const cssH = clip.h * s
      canvas.style.left = `${ox + clip.x * s}px`
      canvas.style.top = `${oy + clip.y * s}px`
      canvas.style.width = `${cssW}px`
      canvas.style.height = `${cssH}px`
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(2, Math.round(Math.min(cssW * dpr, clip.pw)))
      canvas.height = Math.max(2, Math.round(Math.min(cssH * dpr, clip.ph)))
      draw()
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(wrap)

    return () => {
      alive = false
      clearTimeout(t)
      cancelAnimationFrame(raf)
      ro.disconnect()
      v.pause()
      v.removeAttribute('src')
      v.load()
      api.current = null
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clip.src])

  useEffect(() => {
    api.current?.set(active)
  }, [active])

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute" />
    </div>
  )
}
