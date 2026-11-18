import { useEffect, useState } from 'react'

export type Route = 'home' | 'about' | 'work' | 'garage' | 'contact'

const ROUTES: Route[] = ['home', 'about', 'work', 'garage', 'contact']

function parse(hash: string): Route {
  const key = hash.replace(/^#\/?/, '').split('/')[0]
  return (ROUTES as string[]).includes(key) ? (key as Route) : 'home'
}

export function navigate(route: Route) {
  const next = route === 'home' ? '#/' : `#/${route}`
  if (window.location.hash !== next) window.location.hash = next
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
