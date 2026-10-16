import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang, type Pouch } from '../i18n'

// Two stitch lines running along the strap.
const stitches = (dir: '90deg' | '180deg') => ({
  backgroundImage: `repeating-linear-gradient(${dir}, rgb(0 0 0 / 0.35) 0 10px, transparent 10px 18px), repeating-linear-gradient(${dir}, rgb(0 0 0 / 0.35) 0 10px, transparent 10px 18px)`,
  backgroundRepeat: dir === '90deg' ? 'repeat-x' : 'repeat-y',
  backgroundSize: dir === '90deg' ? '100% 2px, 100% 2px' : '2px 100%, 2px 100%',
  backgroundPosition: dir === '90deg' ? '0 5px, 0 20px' : '5px 0, 20px 0',
})

function PouchFace({ name, active }: { name: string; active: boolean }) {
  return (
    <span
      className={`relative block rounded-b-2xl border-x-2 border-b-2 pb-4 pt-9 text-center transition-all duration-300 ${
        active
          ? 'translate-y-2 border-signal bg-signal text-ink shadow-[0_16px_30px_-10px_rgb(242_194_48/0.5)]'
          : 'border-signal-deep bg-[#C99A22] text-ink/80 group-hover:translate-y-1'
      }`}
    >
      {/* flap */}
      <span
        aria-hidden
        className={`absolute inset-x-2 top-0 h-6 rounded-b-xl border-b-2 border-black/25 transition-transform duration-300 ${
          active ? '-translate-y-1 bg-[#FFD75A]' : 'bg-[#B8871A]'
        }`}
      />
      <span className="display relative block px-2 text-xl font-extrabold leading-none">{name}</span>
    </span>
  )
}

// Phones: the pouches hang open from a strap and slide along it; the next one peeks in from the edge.
function SlidingBelt({ pouches, label }: { pouches: Pouch[]; label: string }) {
  const track = useRef<HTMLUListElement>(null)
  const [at, setAt] = useState(0)

  const onScroll = () => {
    const el = track.current
    if (!el || el.children.length < 2) return
    const step = (el.children[1] as HTMLElement).offsetLeft - (el.children[0] as HTMLElement).offsetLeft
    setAt(Math.min(pouches.length - 1, Math.max(0, Math.round(el.scrollLeft / step))))
  }

  const go = (i: number) => {
    const el = track.current
    const item = el?.children[i] as HTMLElement | undefined
    if (!el || !item) return
    el.scrollTo({ left: item.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: 'smooth' })
  }

  return (
    <div className="relative mt-12 md:hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 h-7 bg-signal-deep" style={stitches('90deg')} />
      {/* buckle */}
      <div
        aria-hidden
        className="absolute -top-2 left-3 z-20 h-11 w-14 rounded-md border-4 border-signal bg-ink shadow-[4px_6px_14px_-6px_rgb(0_0_0/0.9)]"
      >
        <span className="absolute inset-y-1 left-1/2 w-1.5 -translate-x-1/2 rounded bg-signal" />
      </div>

      <ul
        ref={track}
        onScroll={onScroll}
        aria-label={label}
        tabIndex={0}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-20 pb-6 pl-20 pr-[22%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pouches.map((p) => (
          <li key={p.name} className="flex w-[72%] shrink-0 snap-start flex-col">
            {/* belt loop wrapped around the strap */}
            <span aria-hidden className="relative z-10 mx-auto -mb-1 block h-9 w-12 rounded-sm border-2 border-black/30 bg-[#B8871A]" />
            <div className="relative flex-1 rounded-b-2xl border-x-2 border-b-2 border-signal-deep bg-signal px-4 pb-5 pt-10 text-ink shadow-[0_16px_30px_-10px_rgb(242_194_48/0.4)]">
              <span aria-hidden className="absolute inset-x-2 top-0 h-7 rounded-b-xl border-b-2 border-black/25 bg-[#FFD75A]" />
              <h3 className="display relative text-2xl font-extrabold leading-none">{p.name}</h3>
              <ul className="mt-3 space-y-1 font-serif text-lg leading-snug">
                {p.tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-1">
        {pouches.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => go(i)}
            aria-label={p.name}
            aria-current={i === at}
            className="grid h-8 w-8 place-items-center"
          >
            <span className={`block h-2.5 rounded-full transition-all ${i === at ? 'w-6 bg-signal' : 'w-2.5 bg-paper/35'}`} />
          </button>
        ))}
      </div>
    </div>
  )
}

// Wider screens: horizontal belt, pick a pouch to open it.
function HorizontalBelt({ pouches, label }: { pouches: Pouch[]; label: string }) {
  const [open, setOpen] = useState(0)
  const id = useId()
  const pouch = pouches[open]

  const onKey = (e: React.KeyboardEvent) => {
    const n = pouches.length
    if (e.key === 'ArrowRight') setOpen((o) => (o + 1) % n)
    if (e.key === 'ArrowLeft') setOpen((o) => (o - 1 + n) % n)
  }

  return (
    <div className="hidden md:block">
      <div className="relative mt-14">
        <div aria-hidden className="absolute inset-x-0 top-0 h-7 bg-signal-deep" style={stitches('90deg')} />
        <div
          role="tablist"
          aria-label={label}
          onKeyDown={onKey}
          className="relative mx-auto flex max-w-6xl justify-between gap-2 px-6 pb-4"
        >
          {pouches.map((p, i) => (
            <button
              key={p.name}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === open}
              aria-controls={`${id}-panel`}
              tabIndex={i === open ? 0 : -1}
              onClick={() => setOpen(i)}
              className="group relative flex-1"
            >
              <PouchFace name={p.name} active={i === open} />
            </button>
          ))}
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${open}`}
        className="mx-auto mt-8 min-h-[5.5rem] max-w-6xl px-6"
      >
        <AnimatePresence mode="wait">
          <motion.ul
            key={pouch.name}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="flex flex-wrap gap-x-8 gap-y-3"
          >
            {pouch.tools.map((tool) => (
              <li key={tool} className="display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-paper">
                {tool}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Belt() {
  const { t } = useLang()
  return (
    <section
      id="arsenal"
      className="scroll-mt-16 overflow-hidden pb-16 pt-24 sm:pt-32"
      style={{ background: 'linear-gradient(180deg, #000 0%, #3B0B0A 100%)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
          <h2 className="display text-[clamp(4rem,11vw,8rem)] font-black text-paper">{t.belt.title}</h2>
          <p className="max-w-sm pb-3 text-lg text-fog">{t.belt.intro}</p>
        </div>
      </div>
      <SlidingBelt pouches={t.pouches} label={t.belt.title} />
      <HorizontalBelt pouches={t.pouches} label={t.belt.title} />
    </section>
  )
}
