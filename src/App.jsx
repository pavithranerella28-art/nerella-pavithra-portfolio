import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Cursor />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
    </>
  )
}
