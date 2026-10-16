import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { BatShape } from './BatSymbol'

// Skyline is authored on a 1600 x 420 canvas and scaled to cover the hero width.
const SKY_W = 1600
const SKY_H = 420
// The rooftop the signal sits on, in skyline units.
const LAMP = { x: 1215, y: SKY_H - 318 }

type Block = { x: number; w: number; h: number; tiers: number; spire: boolean; windows: [number, number][] }

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildLayer(seed: number, minH: number, maxH: number, lit: number, skip?: [number, number]) {
  const r = rng(seed)
  const blocks: Block[] = []
  let x = -20
  while (x < SKY_W + 20) {
    const w = 38 + r() * 90
    if (skip && x + w > skip[0] && x < skip[1]) {
      x = skip[1]
      continue
    }
    // lower on the left so the name reads cleanly, taller towards the lamp
    const bias = 0.55 + 0.45 * Math.min(1, x / 1100)
    const h = (minH + r() * (maxH - minH)) * bias
    const windows: [number, number][] = []
    for (let wy = SKY_H - h + 18; wy < SKY_H - 10; wy += 14) {
      for (let wx = x + 8; wx < x + w - 8; wx += 11) {
        if (r() < lit) windows.push([wx, wy])
      }
    }
    blocks.push({ x, w, h, tiers: Math.floor(r() * 3), spire: r() < 0.22, windows })
    x += w - 2
  }
  return blocks
}

function blockPath(b: Block) {
  // stepped art deco setbacks, optional needle spire
  let d = ''
  let x0 = b.x
  let x1 = b.x + b.w
  let top = SKY_H - b.h
  d += `M${x0} ${SKY_H} L${x0} ${top} `
  const steps: string[] = []
  for (let i = 0; i < b.tiers; i++) {
    const inset = (x1 - x0) * 0.16
    const rise = 14 + i * 6
    d += `L${x0 + inset} ${top} L${x0 + inset} ${top - rise} `
    steps.unshift(`L${x1 - inset} ${top - rise} L${x1 - inset} ${top} L${x1} ${top}`)
    x0 += inset
    x1 -= inset
    top -= rise
  }
  if (b.spire) {
    const mid = (x0 + x1) / 2
    d += `L${mid - 3} ${top} L${mid} ${top - 46} L${mid + 3} ${top} `
  }
  d += `L${x1} ${top} ` + steps.join(' ') + ` L${b.x + b.w} ${SKY_H} Z`
  return d
}

// Highest point of a block, counting setbacks and spire, in skyline units.
function blockHeight(b: Block) {
  let rise = 0
  for (let i = 0; i < b.tiers; i++) rise += 14 + i * 6
  return b.h + rise + (b.spire ? 46 : 0)
}

// Trim a block down to `cap` units: spire goes first, then setbacks, then the shaft itself.
function fitBlock(b: Block, cap: number): Block {
  if (blockHeight(b) <= cap) return b
  let fit: Block = { ...b, spire: false }
  while (fit.tiers > 0 && blockHeight(fit) > cap) fit = { ...fit, tiers: fit.tiers - 1 }
  if (blockHeight(fit) > cap) fit = { ...fit, h: Math.max(0, cap) }
  const top = SKY_H - fit.h
  return { ...fit, windows: b.windows.filter(([, y]) => y >= top + 12) }
}

// Text boxes in host pixels; the skyline is fitted around them.
type Span = { l: number; r: number; b: number }
const GAP = 24
const PAD_X = 12
// Street level plus a sliver of rooftops, always visible under the text.
const MIN_SKY = 140
const TOWER_X: [number, number] = [1160, 1270]
const TOWER_H = 322
// Skyline units that should fill the free space under the text on narrow screens.
const ROOM_UNITS = 330

// The lamp tower: a deco tower with a platform for the signal.
const TOWER =
  `M1160 ${SKY_H} L1160 ${SKY_H - 250} L1172 ${SKY_H - 250} L1172 ${SKY_H - 280} L1186 ${SKY_H - 280} L1186 ${SKY_H - 300} ` +
  `L1244 ${SKY_H - 300} L1244 ${SKY_H - 280} L1258 ${SKY_H - 280} L1258 ${SKY_H - 250} L1270 ${SKY_H - 250} L1270 ${SKY_H} Z`

function useSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, ...size }
}

export function Gotham({ children }: { children: ReactNode }) {
  const { ref, w, h } = useSize()
  const reduce = useReducedMotion()
  const far = useMemo(() => buildLayer(7, 180, 400, 0, undefined), [])
  const near = useMemo(() => buildLayer(23, 70, 250, 0.05, [1150, 1280]), [])

  // Measure the actual glyph lines and buttons, so buildings can rise right up to them.
  const contentRef = useRef<HTMLDivElement>(null)
  const [spans, setSpans] = useState<Span[]>([])
  const [vh, setVh] = useState(800)
  useEffect(() => {
    const on = () => setVh(window.innerHeight)
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  // Cover the width, and on narrow screens grow until the city fills the room left under the text.
  const textBottom = spans.reduce((m, s) => Math.max(m, s.b), 0)
  const room = spans.length ? vh - textBottom - GAP : 0
  const scale = Math.max(w / SKY_W, Math.min(1.2, room / ROOM_UNITS), 0.5)
  // centred, but never so far left that the signal tower leaves the screen
  const offX = Math.min((w - SKY_W * scale) / 2, w * 0.82 - LAMP.x * scale)
  const offY = h - SKY_H * scale
  useLayoutEffect(() => {
    const el = contentRef.current?.querySelector<HTMLElement>('[data-hero-content]')
    const host = ref.current
    if (!el || !host) return
    const measure = () => {
      const box = host.getBoundingClientRect()
      const rects: DOMRect[] = Array.from(el.querySelectorAll('a, button'), (a) => a.getBoundingClientRect())
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const range = document.createRange()
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        range.selectNodeContents(n)
        rects.push(...Array.from(range.getClientRects()))
      }
      setSpans(
        rects
          .filter((r) => r.width > 0 && r.height > 0)
          .map((r) => ({ l: r.left - box.left - PAD_X, r: r.right - box.left + PAD_X, b: r.bottom - box.top })),
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, ref])

  const toUnits = (s: Span) => [(s.l - offX) / scale, (s.r - offX) / scale] as const

  // The hero keeps a full screen; it only grows when the text leaves no room for the street or the tower.
  let minH = 0
  for (const s of spans) {
    const [uL, uR] = toUnits(s)
    const sky = uR > TOWER_X[0] && uL < TOWER_X[1] ? TOWER_H : MIN_SKY
    minH = Math.max(minH, Math.ceil(s.b + GAP + sky * scale))
  }

  // Near buildings under a line of text stop just below it.
  const fitted = near.map((b) => {
    let cap = Infinity
    for (const s of spans) {
      const [uL, uR] = toUnits(s)
      if (b.x < uR && b.x + b.w > uL) cap = Math.min(cap, (h - s.b - GAP) / scale)
    }
    return fitBlock(b, cap)
  })

  const sky = `translate(${offX} ${offY}) scale(${scale})`
  const sx = offX + LAMP.x * scale
  const sy = offY + LAMP.y * scale

  const tx = useMotionValue(w * 0.66)
  const ty = useMotionValue(h * 0.2)
  const px = useSpring(tx, { stiffness: 40, damping: 14 })
  const py = useSpring(ty, { stiffness: 40, damping: 14 })
  const hovering = useRef(false)

  useEffect(() => {
    if (!hovering.current) {
      tx.set(w * 0.66)
      ty.set(h * 0.2)
    }
  }, [w, h, tx, ty])

  // slow patrol sweep when nobody is steering
  useAnimationFrame((t) => {
    if (hovering.current || reduce) return
    tx.set(w * (0.62 + Math.sin(t / 3200) * 0.1))
    ty.set(h * (0.19 + Math.sin(t / 2100) * 0.03))
  })

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const box = ref.current!.getBoundingClientRect()
    hovering.current = true
    tx.set(Math.min(w * 0.94, Math.max(w * 0.06, e.clientX - box.left)))
    ty.set(Math.min(h * 0.45, Math.max(h * 0.08, e.clientY - box.top)))
  }

  const rx = Math.max(70, Math.min(150, w * 0.09))
  const ry = rx * 0.62

  const beam = useTransform([px, py], ([x, y]: number[]) => {
    const dx = x - sx
    const dy = y - sy
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    const spread = rx * 0.95
    return [
      `${sx + nx * 7},${sy + ny * 7}`,
      `${x + nx * spread},${y + ny * spread * 0.7}`,
      `${x - nx * spread},${y - ny * spread * 0.7}`,
      `${sx - nx * 7},${sy - ny * 7}`,
    ].join(' ')
  })
  const gx2 = px
  const gy2 = py
  const batK = (rx * 1.35) / 200
  const bx = useTransform(px, (x) => x - 100 * batK)
  const by = useTransform(py, (y) => y - 58 * batK)

  const flicker = reduce
    ? { opacity: 1 }
    : { opacity: [0, 0.9, 0.1, 0.7, 0, 1], transition: { delay: 0.5, duration: 1.4, times: [0, 0.1, 0.25, 0.4, 0.55, 1] } }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => (hovering.current = false)}
      className="relative isolate min-h-[100svh] overflow-hidden"
      style={{ minHeight: minH ? `max(100svh, ${minH}px)` : undefined, background: 'radial-gradient(120% 80% at 60% 10%, #A8261A 0%, #8C1C13 35%, #3B0B0A 80%)' }}
    >
      <svg className="absolute inset-0 -z-10 h-full w-full" width={w} height={h} aria-hidden>
        <defs>
          <filter id="cloud-blur" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
          <radialGradient id="disc-grad">
            <stop offset="0" stopColor="#FFE680" />
            <stop offset="0.7" stopColor="#F2C230" stopOpacity="0.85" />
            <stop offset="1" stopColor="#F2C230" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* low cloud deck the signal lands on */}
        <g filter="url(#cloud-blur)" fill="#5E130D" opacity="0.9">
          <ellipse cx={w * 0.2} cy={h * 0.14} rx={w * 0.32} ry={h * 0.07} />
          <ellipse cx={w * 0.7} cy={h * 0.1} rx={w * 0.38} ry={h * 0.08} />
          <ellipse cx={w * 0.5} cy={h * 0.3} rx={w * 0.3} ry={h * 0.05} fill="#4A0F0B" />
        </g>

        <g transform={sky} fill="#2A0807">
          {far.map((b, i) => (
            <path key={i} d={blockPath(b)} />
          ))}
        </g>

        <motion.g initial={{ opacity: 0 }} animate={flicker} style={{ mixBlendMode: 'screen' }}>
          <motion.linearGradient id="beam-grad-live" gradientUnits="userSpaceOnUse" x1={sx} y1={sy} x2={gx2} y2={gy2}>
            <stop offset="0" stopColor="#FFF4C9" stopOpacity="0.55" />
            <stop offset="1" stopColor="#F2C230" stopOpacity="0.12" />
          </motion.linearGradient>
          <motion.polygon points={beam} fill="url(#beam-grad-live)" />
          <motion.ellipse cx={px} cy={py} rx={rx} ry={ry} fill="url(#disc-grad)" />
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={flicker}>
          <motion.g style={{ x: bx, y: by }}>
            <g transform={`scale(${batK})`}>
              <BatShape fill="#1A0303" />
            </g>
          </motion.g>
        </motion.g>
      </svg>

      <div ref={contentRef} className="relative z-10">
        {children}
      </div>

      {/* near skyline sits in front of the text, fitted so it never covers it */}
      <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" width={w} height={h} aria-hidden>
        <g transform={sky}>
          <g fill="#000">
            {fitted.map((b, i) => (
              <path key={i} d={blockPath(b)} />
            ))}
            <path d={TOWER} />
            {/* street level, closes gaps between buildings */}
            <rect x={-60} y={SKY_H - 90} width={SKY_W + 120} height={400} />
            {/* the lamp housing */}
            <rect x={LAMP.x - 16} y={LAMP.y - 2} width={32} height={20} rx={3} />
          </g>
          <g fill="#F2C230" opacity="0.75">
            {fitted.flatMap((b, i) => b.windows.map(([x, y], j) => <rect key={`${i}-${j}`} x={x} y={y} width={4} height={6} />))}
          </g>
          <motion.rect
            x={LAMP.x - 12}
            y={LAMP.y - 4}
            width={24}
            height={4}
            fill="#FFE680"
            initial={{ opacity: 0 }}
            animate={flicker}
          />
        </g>
      </svg>
    </div>
  )
}
