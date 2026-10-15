import { useEffect, useState } from 'react'
import { useLang, type Lang } from '../i18n'
import { Gotham } from '../components/Gotham'
import { BatSymbol } from '../components/BatSymbol'
import DecryptedText from '../components/reactbits/DecryptedText'

export function Nav() {
  const { t, lang, setLang } = useLang()
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const links: [string, string][] = [
    ['#casos', t.nav.cases],
    ['#trajetoria', t.nav.path],
    ['#arsenal', t.nav.belt],
    ['#contato', t.nav.contact],
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? 'bg-ink/90 backdrop-blur' : 'bg-transparent'}`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2 text-paper" aria-label="Pedro Szpak">
          <BatSymbol className="h-5 w-9 text-signal" />
          <span className="display text-xl font-extrabold">PS</span>
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={href} className="display text-lg font-semibold text-paper/80 transition-colors hover:text-signal">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex overflow-hidden rounded-full border border-paper/30" role="group" aria-label="Idioma / Language">
          {(['pt', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`display px-3 py-1 text-base font-bold transition-colors ${
                lang === l ? 'bg-signal text-ink' : 'text-paper/70 hover:text-paper'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}

export function Hero() {
  const { t, lang } = useLang()
  return (
    <section id="top" aria-label={`${t.hero.first} ${t.hero.last}`}>
      <Gotham>
        <div className="mx-auto max-w-6xl px-4 pt-[max(16svh,6rem)] sm:px-6 md:pt-[max(18svh,7rem)]">
          <div data-hero-content className="w-fit max-w-full">
          <h1 className="display font-black uppercase text-paper text-[clamp(4.75rem,17vw,13.5rem)] drop-shadow-[0_6px_0_rgb(0_0_0/0.35)]">
            <span className="block">{t.hero.first}</span>
            <span className="block pl-[0.35em]">{t.hero.last}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[clamp(1.25rem,2.4vw,1.6rem)] italic leading-snug text-paper">
            <DecryptedText
              key={lang}
              text={t.hero.line}
              animateOn="view"
              sequential
              speed={28}
              revealDirection="start"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*"
              encryptedClassName="text-signal not-italic"
            />
          </p>
          <p className="mt-3 max-w-md text-base text-paper/75 sm:text-lg">{t.hero.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#casos"
              className="display rounded-sm bg-signal px-5 py-2.5 text-xl font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              {t.hero.seeCases}
            </a>
            <a
              href={t.cv}
              target="_blank"
              rel="noreferrer"
              className="display rounded-sm border-2 border-paper/70 px-5 py-2 text-xl font-bold text-paper transition-colors hover:border-signal hover:text-signal"
            >
              {t.hero.cv}
            </a>
          </div>
          </div>
        </div>
        <p className="pointer-events-none absolute right-6 top-20 hidden text-sm italic text-paper/50 [@media(pointer:fine)]:md:block">
          {t.hero.hint}
        </p>
      </Gotham>
    </section>
  )
}
