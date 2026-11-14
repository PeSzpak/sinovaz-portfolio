import { useLang, type CaseFile } from '../i18n'
import { Evidence } from '../components/Evidence'

const hasPhoto = (f: CaseFile) => Boolean(f.media)

function Links({ file, dark = true }: { file: CaseFile; dark?: boolean }) {
  const { t } = useLang()
  const base = 'display text-lg font-bold underline decoration-2 underline-offset-4 transition-colors'
  const tone = dark ? 'text-ink decoration-sky hover:text-sky' : 'text-paper decoration-signal hover:text-signal'
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2">
      {file.url && (
        <a className={`${base} ${tone}`} href={file.url} target="_blank" rel="noreferrer">
          {t.cases.open}
        </a>
      )}
      {file.repo && (
        <a className={`${base} ${tone}`} href={file.repo} target="_blank" rel="noreferrer">
          {t.cases.code}
        </a>
      )}
    </div>
  )
}

function Stamp({ status, className = '' }: { status: CaseFile['status']; className?: string }) {
  const { t } = useLang()
  return <span className={`stamp inline-block text-xl ${className}`}>{t.cases.status[status]}</span>
}

function Featured({ file, flip }: { file: CaseFile; flip: boolean }) {
  const { t } = useLang()
  return (
    <article
      className={`paper relative grid gap-8 rounded-[3px] p-6 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] sm:p-10 md:gap-12 ${
        !hasPhoto(file) ? '' : flip ? 'md:grid-cols-[1fr_0.55fr]' : 'md:grid-cols-[1.05fr_1fr]'
      }`}
    >
      {hasPhoto(file) && (
        <div className={`md:pt-4 ${flip ? 'md:order-2 md:rotate-[1.5deg]' : 'md:-rotate-[1.5deg]'}`}>
          <Evidence file={file} />
        </div>
      )}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="display text-[clamp(3rem,7vw,5rem)] font-black">{file.name}</h3>
          <Stamp status={file.status} className="mt-2 rotate-[8deg]" />
        </div>
        <p className="mt-4 text-lg leading-relaxed">{file.summary}</p>
        <ul className="mt-5 space-y-2.5 text-base">
          {file.points.map((p) => (
            <li key={p} className="border-l-2 border-sky/60 pl-3">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-ink/70">
          <span className="italic">{t.cases.stackLabel}</span> {file.stack.join(', ')}
        </p>
        <div className="mt-6">
          <Links file={file} />
        </div>
      </div>
    </article>
  )
}

const tilts = ['md:rotate-[0.8deg]', 'md:-rotate-[0.6deg] md:mt-10', 'md:rotate-[0.4deg] md:mt-4']

function Smaller({ file, i }: { file: CaseFile; i: number }) {
  const { t } = useLang()
  return (
    <article
      className={`paper relative flex flex-col rounded-[3px] p-6 shadow-[0_24px_40px_-18px_rgb(0_0_0/0.9)] ${tilts[i % tilts.length]}`}
    >
      {hasPhoto(file) && (
        <div className="mb-6">
          <Evidence file={file} />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="display text-4xl font-black">{file.name}</h3>
        <Stamp status={file.status} className="-rotate-[6deg] text-base" />
      </div>
      <p className="mt-3 text-base leading-relaxed">{file.summary}</p>
      {file.points.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-[0.95rem]">
          {file.points.map((p) => (
            <li key={p} className="border-l-2 border-sky/60 pl-3">
              {p}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-sm text-ink/70">
        <span className="italic">{t.cases.stackLabel}</span> {file.stack.join(', ')}
      </p>
      <div className="mt-auto pt-5">
        <Links file={file} />
      </div>
    </article>
  )
}

export function Cases() {
  const { t } = useLang()
  const featured = t.files.filter((f) => f.tier === 'featured')
  const rest = t.files.filter((f) => f.tier === 'smaller')
  return (
    <section id="casos" className="scroll-mt-16 bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 grid gap-4 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
          <h2 className="display text-[clamp(4rem,11vw,8rem)] font-black text-paper">{t.cases.title}</h2>
          <p className="max-w-md pb-3 text-lg text-fog">{t.cases.intro}</p>
        </div>

        <div className="space-y-14">
          {featured.map((f, i) => (
            <Featured key={f.id} file={f} flip={i % 2 === 1} />
          ))}
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {rest.map((f, i) => (
            <Smaller key={f.id} file={f} i={i} />
          ))}
        </div>

        <div className="mt-28 grid gap-6 md:grid-cols-[1fr_2fr] md:gap-12">
          <div>
            <h3 className="display text-5xl font-black text-paper">{t.cases.archiveTitle}</h3>
            <p className="mt-3 text-fog">{t.cases.archiveIntro}</p>
          </div>
          <ul className="divide-y divide-kevlar/50 border-y border-kevlar/50">
            {t.archive.map((a) => (
              <li key={a.name}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="display shrink-0 text-2xl font-bold text-paper transition-colors group-hover:text-signal">
                    {a.name}
                  </span>
                  <span className="text-base text-fog sm:text-right">{a.note}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
