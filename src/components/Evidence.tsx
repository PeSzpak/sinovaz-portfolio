import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLang, type CaseFile, type Media, type ThemeId } from '../i18n'

type View = ThemeId | 'video' | 'trailer'

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
  return file.media ? <Photo file={file} media={file.media} /> : null
}

function Photo({ file, media }: { file: CaseFile; media: Media }) {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const [still] = useState(() => reduce === true || saveData())
  const views: View[] = [...(media.trailer ? (['trailer'] as const) : []), ...(media.video ? (['video'] as const) : []), ...media.themes]
  const [view, setView] = useState<View>(still ? media.themes[0] : media.trailer ? 'trailer' : media.video ? 'video' : media.themes[0])
  const [shown, setShown] = useState<View[]>([view])
  const [near, setNear] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const trailer = useRef<HTMLVideoElement>(null)
  const dir = `/media/${file.id}`

  // native lazy loading starts ~1250px early and posters are never lazy, so mount layers only near the viewport
  useEffect(() => {
    const el = box.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const show = (v: View) => {
    setView(v)
    setShown((s) => (s.includes(v) ? s : [...s, v]))
  }
  const mounted = (v: View) => near && shown.includes(v)

  useEffect(() => {
    const v = view === 'video' ? video.current : view === 'trailer' ? trailer.current : null
    if (!v || still) return
    // Safari in Low Power Mode rejects autoplay until the page gets a user gesture, so retry on the first one
    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    const retry = () => {
      events.forEach((e) => document.removeEventListener(e, retry))
      v.play().catch(() => {})
    }
    v.play().catch(() => events.forEach((e) => document.addEventListener(e, retry)))
    return () => {
      events.forEach((e) => document.removeEventListener(e, retry))
      v.pause()
    }
  }, [view, still, near])

  const layer = (on: boolean) =>
    `absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${on ? 'opacity-100' : 'pointer-events-none opacity-0'}`
  const label = (v: View) => (v === 'video' ? t.cases.demo : v === 'trailer' ? t.cases.trailer : t.cases.views[v])

  return (
    <div className={media.frame === 'tall' ? 'mx-auto w-full max-w-[17rem]' : ''}>
      <div className={frame}>
        <span aria-hidden className={tape} />
        <div ref={box} className={`evidence relative overflow-hidden ${media.frame === 'tall' ? 'aspect-[9/16]' : 'aspect-[16/10]'}`} data-view={view}>
          {media.themes.filter(mounted).map((th) => (
            <img
              key={th}
              src={`${dir}/${th}.webp`}
              alt={`${file.name}, ${t.cases.views[th]}`}
              loading="lazy"
              aria-hidden={view !== th}
              className={layer(view === th)}
            />
          ))}
          {media.video && mounted('video') && (
            <video
              ref={video}
              muted
              loop
              autoPlay={!still && view === 'video'}
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
          {media.trailer && mounted('trailer') && (
            <video
              ref={trailer}
              muted
              loop
              autoPlay={!still}
              controls
              playsInline
              preload="none"
              poster={`${dir}/trailer-poster.webp`}
              aria-label={`${file.name}, ${t.cases.trailer}`}
              inert={view !== 'trailer'}
              className={layer(view === 'trailer')}
            >
              <source src={`${dir}/trailer.webm`} type="video/webm" />
              <source src={`${dir}/trailer.mp4`} type="video/mp4" />
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
                onClick={() => show(v)}
                aria-pressed={view === v}
                className={`display whitespace-nowrap px-2.5 py-1.5 text-base font-bold transition-colors ${
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
