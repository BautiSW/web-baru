import { AnimatePresence } from 'motion/react'
import { Scene } from '@/components/Scene'
import { Hud } from '@/components/Hud'
import { Dock } from '@/components/Dock'
import { About } from '@/pages/About'
import { Work } from '@/pages/Work'
import { Garage } from '@/pages/Garage'
import { Contact } from '@/pages/Contact'
import { navigate, useRoute } from '@/lib/router'

export default function App() {
  const route = useRoute()

  return (
    <>
      <Hud />
      <AnimatePresence mode="wait">
        {route === 'home' && <Scene key="home" onEnter={navigate} />}
        {route === 'about' && <About key="about" />}
        {route === 'work' && <Work key="work" />}
        {route === 'garage' && <Garage key="garage" />}
        {route === 'contact' && <Contact key="contact" />}
      </AnimatePresence>
      <Dock route={route} />
    </>
  )
}
