import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLang, type CaseFile, type Media, type ThemeId } from '../i18n'

type View = ThemeId | 'video'

const saveData = () =>
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true

const tape = 'absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-paper-shade/80 shadow-sm'
const frame = 'evidence-wrap relative block bg-white p-2 pb-8 shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]'

function Caption({ file }: { file: CaseFile }) {
  const href = file.url ?? file.repo
  const label = href?.replace('https://', '') ?? file.name
  const cls = 'absolute bottom-1.5 left-3 font-serif text-sm italic text-ink/70'
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={`${cls} underline decoration-ink/30 underline-offset-2 hover:text-ink`}>
      {label}
    </a>
  ) : (
    <span className={cls}>{label}</span>
  )
}

export function Evidence({ file }: { file: CaseFile }) {
  if (file.media) return <Photo file={file} media={file.media} />
  if (!file.shot) return null
  return (
    <div className={frame}>
      <span aria-hidden className={tape} />
      <img src={file.shot} alt={file.name} loading="lazy" className="evidence aspect-[16/10] w-full object-cover object-top" />
      <Caption file={file} />
    </div>
  )
}

function Photo({ file, media }: { file: CaseFile; media: Media }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [still] = useState(() => reduce === true || saveData())
  const views: View[] = media.video ? [...media.themes, 'video'] : [...media.themes]
  const [view, setView] = useState<View>(media.video && !still ? 'video' : media.themes[0])
  const video = useRef<HTMLVideoElement>(null)
  const dir = `/media/${file.id}`

  useEffect(() => {
    const v = video.current
    if (view !== 'video' || !v) return
    if (still) return () => v.pause()
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.6 },
    )
    io.observe(v)
    return () => {
      io.disconnect()
      v.pause()
    }
  }, [view, still])

  const layer = (on: boolean) =>
    `absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${on ? 'opacity-100' : 'pointer-events-none opacity-0'}`
  const label = (v: View) => (v === 'video' ? t.cases.demo : t.cases.views[v])

  return (
    <div className={media.frame === 'tall' ? 'mx-auto w-full max-w-[17rem]' : ''}>
      <div className={frame}>
        <span aria-hidden className={tape} />
        <div className={`evidence relative overflow-hidden ${media.frame === 'tall' ? 'aspect-[9/16]' : 'aspect-[16/10]'}`} data-view={view}>
          {media.themes.map((th) => (
            <img
              key={th}
              src={`${dir}/${th}.webp`}
              alt={`${file.name}, ${t.cases.views[th]}`}
              loading="lazy"
              aria-hidden={view !== th}
              className={layer(view === th)}
            />
          ))}
          {media.video && (
            <video
              ref={video}
              muted
              loop
              playsInline
              preload="none"
              controls={still}
              poster={`${dir}/poster.webp`}
              aria-label={`${file.name}, ${t.cases.demo}`}
              inert={view !== 'video'}
              className={layer(view === 'video')}
            >
              <source src={`${dir}/demo.webm`} type="video/webm" />
              <source src={`${dir}/demo.mp4`} type="video/mp4" />
            </video>
          )}
        </div>
        <Caption file={file} />
      </div>
      {views.length > 1 && (
        <div className="mt-5 flex justify-center">
          <div className="flex overflow-hidden rounded-full border border-ink/40" role="group" aria-label={file.name}>
            {views.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`display px-4 py-1.5 text-base font-bold transition-colors ${
                  view === v ? 'bg-ink text-paper' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {label(v)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
