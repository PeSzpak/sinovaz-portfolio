import Noise from './components/reactbits/Noise'
import { Hero, Nav } from './sections/Top'
import { Cases } from './sections/Cases'
import { Path } from './sections/Path'
import { Belt } from './sections/Belt'
import { Contact, Footer, Record } from './sections/Closing'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Cases />
        <Path />
        <Belt />
        <Record />
        <Contact />
      </main>
      <Footer />
      <Noise fixed zIndex={60} opacity={0.07} fps={12} blendMode="overlay" />
    </>
  )
}
