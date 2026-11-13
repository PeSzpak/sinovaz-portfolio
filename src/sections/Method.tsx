import { useLang } from '../i18n'

const lamps = ['bg-signal shadow-[0_0_22px_4px_rgb(242_194_48/0.5)]', 'bg-sky', 'bg-[#3f9b5c]']

export function Method() {
  const { t } = useLang()
  const m = t.method
  return (
    <section id="metodo" className="scroll-mt-16 bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 sm:px-6 md:grid-cols-[1fr_1.7fr] md:gap-16">
        <div className="self-start md:sticky md:top-24">
          <h2 className="display text-[clamp(3.25rem,7.5vw,5.5rem)] font-black leading-[0.9] text-paper">{m.title}</h2>
          <p className="mt-5 max-w-sm text-lg text-fog">{m.intro}</p>
          <ul className="mt-10 space-y-4" aria-label="Semáforo">
            {m.lights.map((label, i) => (
              <li key={label} className="flex items-center gap-4">
                <span aria-hidden className={`h-6 w-6 rounded-full ${lamps[i]}`} />
                <span className="display text-2xl font-bold text-paper">{label}</span>
              </li>
            ))}
          </ul>
        </div>
        <ol className="space-y-16">
          {m.items.map((item) => (
            <li key={item.title}>
              <h3 className="display text-[clamp(2.25rem,5vw,3.25rem)] font-black text-signal">{item.title}</h3>
              <div className="mt-4 max-w-2xl space-y-4 text-[clamp(1.15rem,2vw,1.45rem)] leading-snug text-paper">
                {item.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="display mt-5 inline-block text-lg font-bold text-paper underline decoration-signal decoration-2 underline-offset-4 transition-colors hover:text-signal"
                >
                  {item.link.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
