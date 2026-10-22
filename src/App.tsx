import { ScrollProgress } from './components/ui/scroll-progress'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { HowIUseAI } from './components/HowIUseAI'
import { Timeline } from './components/Timeline'
import { Projects } from './components/Projects'
import { Tools } from './components/Tools'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowIUseAI />
        <Timeline />
        <Projects />
        <Tools />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
