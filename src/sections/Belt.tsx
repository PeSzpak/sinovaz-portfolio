import { useId, useState } from 'react'
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

// Phones: the belt hangs vertically and every pouch shows its contents. Nothing to discover.
function VerticalBelt({ pouches }: { pouches: Pouch[] }) {
  return (
    <div className="relative mt-12 px-4 md:hidden">
      <div aria-hidden className="absolute bottom-0 left-4 top-0 w-7 bg-signal-deep" style={stitches('180deg')} />
      <ul className="relative space-y-7">
        {pouches.map((p) => (
          <li key={p.name} className="flex items-start">
            {/* pouch clipped to the strap */}
            <span className="relative z-10 ml-3.5 w-[7.5rem] shrink-0 rounded-r-xl border-y-2 border-r-2 border-signal-deep bg-signal py-2 pl-3 pr-4 shadow-[6px_8px_18px_-8px_rgb(0_0_0/0.8)]">
              <span aria-hidden className="absolute inset-y-1 left-0 w-1.5 rounded-r bg-[#B8871A]" />
              <span className="display block text-lg font-extrabold leading-none text-ink">{p.name}</span>
            </span>
            <p className="ml-4 pt-0.5 font-serif text-lg leading-snug text-paper">{p.tools.join(', ')}</p>
          </li>
        ))}
      </ul>
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
      <VerticalBelt pouches={t.pouches} />
      <HorizontalBelt pouches={t.pouches} label={t.belt.title} />
    </section>
  )
}
