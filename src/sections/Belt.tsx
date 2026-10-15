import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLang } from '../i18n'

export function Belt() {
  const { t } = useLang()
  const [open, setOpen] = useState(0)
  const id = useId()
  const pouch = t.pouches[open]

  const onKey = (e: React.KeyboardEvent) => {
    const n = t.pouches.length
    if (e.key === 'ArrowRight') setOpen((o) => (o + 1) % n)
    if (e.key === 'ArrowLeft') setOpen((o) => (o - 1 + n) % n)
  }

  return (
    <section
      id="arsenal"
      className="scroll-mt-16 overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20"
      style={{ background: 'linear-gradient(180deg, #000 0%, #3B0B0A 100%)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
          <h2 className="display text-[clamp(4rem,11vw,8rem)] font-black text-paper">{t.belt.title}</h2>
          <p className="max-w-sm pb-3 text-lg text-fog">{t.belt.intro}</p>
        </div>
      </div>

      {/* the belt: a strap with pouches hanging from it */}
      <div className="relative mt-14">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-7 bg-signal-deep"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(0 0 0 / 0.35) 0 10px, transparent 10px 18px), repeating-linear-gradient(90deg, rgb(0 0 0 / 0.35) 0 10px, transparent 10px 18px)',
            backgroundSize: '100% 2px, 100% 2px',
            backgroundPosition: '0 5px, 0 20px',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <div
          role="tablist"
          aria-label={t.belt.title}
          onKeyDown={onKey}
          className="relative mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:px-6 md:justify-between md:overflow-visible"
        >
          {t.pouches.map((p, i) => {
            const active = i === open
            return (
              <button
                key={p.name}
                role="tab"
                id={`${id}-tab-${i}`}
                aria-selected={active}
                aria-controls={`${id}-panel`}
                tabIndex={active ? 0 : -1}
                onClick={() => setOpen(i)}
                className="group relative w-32 shrink-0 md:w-auto md:flex-1"
              >
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
                      active ? 'bg-[#FFD75A] -translate-y-1' : 'bg-[#B8871A]'
                    }`}
                  />
                  <span className="display relative block px-2 text-lg font-extrabold leading-none sm:text-xl">
                    {p.name}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${open}`}
        className="mx-auto mt-8 min-h-[7.5rem] max-w-6xl px-4 sm:px-6"
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
    </section>
  )
}
