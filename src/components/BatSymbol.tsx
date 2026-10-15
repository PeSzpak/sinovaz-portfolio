// Hand-drawn bat, right half mirrored. viewBox is 200 x 110 with the body on x = 100.
export const BAT_HALF =
  'M100 34 L104 34 L107 20 L111 36 C118 40 128 38 134 26 C156 28 182 36 198 58 C190 62 180 64 176 74 C168 68 154 68 150 80 C138 74 122 78 114 90 L100 104 Z'

export function BatShape({ fill = 'currentColor' }: { fill?: string }) {
  return (
    <g fill={fill} stroke={fill} strokeWidth={0.6} strokeLinejoin="round">
      <path d={BAT_HALF} />
      <path d={BAT_HALF} transform="translate(200 0) scale(-1 1)" />
    </g>
  )
}

export function BatSymbol({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 200 110" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <BatShape />
    </svg>
  )
}
