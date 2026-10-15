import { useLang } from '../i18n'

export function Path() {
  const { t } = useLang()
  return (
    <section id="trajetoria" className="scroll-mt-16 border-t border-kevlar/40 bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-[1fr_2.2fr]">
        <h2 className="display self-start text-[clamp(4rem,9vw,6.5rem)] font-black text-paper md:sticky md:top-24">
          {t.path.title}
        </h2>
        <ol className="relative border-l-2 border-kevlar/60">
          {t.jobs.map((job, i) => (
            <li key={job.company} className="relative pb-16 pl-8 last:pb-0 sm:pl-12">
              <span
                aria-hidden
                className={`absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 ${
                  i === 0 ? 'border-signal bg-signal shadow-[0_0_18px_4px_rgb(242_194_48/0.45)]' : 'border-kevlar bg-ink'
                }`}
              />
              <p className={`display text-xl font-bold ${i === 0 ? 'text-signal' : 'text-fog'}`}>{job.when}</p>
              <h3 className="display mt-1 text-[clamp(2.25rem,5vw,3.25rem)] font-black text-paper">{job.company}</h3>
              <p className="mt-1 text-lg italic text-paper/80">
                {job.role}, {job.where}
              </p>
              <ul className="mt-5 max-w-2xl space-y-2 text-fog">
                {job.points.map((p) => (
                  <li key={p} className="pl-4 -indent-4">
                    <span className="mr-2 text-signal">/</span>
                    {p}
                  </li>
                ))}
              </ul>
              {job.stack && <p className="mt-4 text-sm text-fog">{job.stack.join(', ')}</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
