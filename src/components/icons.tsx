import type { CSSProperties, ReactNode } from "react"
import type { IconName } from "@/types"

/**
 * Every glyph in the app is drawn here on a 24x24 grid with `currentColor`
 * strokes, so icons inherit text colour and stay legible at any size.
 */
const GLYPHS: Record<IconName, ReactNode> = {
  // ─── Moods ────────────────────────────────────────────────────────────────
  spark: (
    <path d="M12 3.2 13.7 9 19.5 10.7 13.7 12.4 12 18.2 10.3 12.4 4.5 10.7 10.3 9Z" />
  ),
  wave: (
    <>
      <path d="M3 8.8c1.8-1.9 3.6-1.9 5.4 0s3.6 1.9 5.4 0 3.6-1.9 5.4 0" />
      <path d="M3 14.4c1.8-1.9 3.6-1.9 5.4 0s3.6 1.9 5.4 0 3.6-1.9 5.4 0" />
    </>
  ),
  cloud: (
    <path d="M7.2 18.2h9.3a3.4 3.4 0 0 0 .3-6.8 5 5 0 0 0-9.6 1.5 3.4 3.4 0 0 0 .1 5.3Z" />
  ),
  rain: (
    <>
      <path d="M7.2 15h9.3a3.4 3.4 0 0 0 .3-6.8 5 5 0 0 0-9.6 1.5 3.4 3.4 0 0 0 .1 5.3Z" />
      <path d="M8.4 17.6 7.7 20M12 17.6l-.7 2.4M15.6 17.6l-.7 2.4" />
    </>
  ),
  leaf: (
    <>
      <path d="M5.4 18.8c0-8.4 5.8-13.4 13.2-13.4 0 7.6-5.4 13.4-13.2 13.4Z" />
      <path d="m5.4 18.8 9.4-9.4" />
    </>
  ),

  // ─── Navigation ───────────────────────────────────────────────────────────
  home: (
    <>
      <path d="m4 10.6 8-6.4 8 6.4V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19Z" />
      <path d="M9.6 20.6V14h4.8v6.6" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.6S10 4.6 6 4.6H4v13h2c4 0 6 1.8 6 1.8s2-1.8 6-1.8h2v-13h-2c-4 0-6 2-6 2Z" />
      <path d="M12 6.6v12.8" />
    </>
  ),
  sprout: (
    <>
      <path d="M12 20.4v-6.6" />
      <path d="M12 13.8c0-3-2-5-5.4-5 0 3 2 5 5.4 5Z" />
      <path d="M12 13.8c0-3.6 2.6-6.2 6.2-6.2 0 3.6-2.6 6.2-6.2 6.2Z" />
    </>
  ),
  bag: (
    <>
      <path d="M6.2 8h11.6l.9 12H5.3Z" />
      <path d="M9.2 8V6.4a2.8 2.8 0 0 1 5.6 0V8" />
    </>
  ),

  // ─── Missions ─────────────────────────────────────────────────────────────
  walk: (
    <>
      <circle cx="13.6" cy="4.8" r="1.6" />
      <path d="m12.4 8.4-3.2 4 1.6 2.6-1.4 4.6" />
      <path d="m12.6 9.8 3.8 2.6" />
      <path d="m10.8 15 4.2 2.6.6 2.8" />
    </>
  ),
  drop: (
    <path d="M12 3.6c3 3.8 5 6.5 5 8.7a5 5 0 0 1-10 0c0-2.2 2-4.9 5-8.7Z" />
  ),
  breeze: (
    <>
      <path d="M3.4 8.6h10.4a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3.4 13h13.2a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3.4 17.4h7.4" />
    </>
  ),
  moon: (
    <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" />
  ),
  chat: (
    <path d="M20 6.6a1.2 1.2 0 0 0-1.2-1.2H5.2A1.2 1.2 0 0 0 4 6.6v8.6a1.2 1.2 0 0 0 1.2 1.2h3.3V20.4l5-4h6.3a1.2 1.2 0 0 0 1.2-1.2Z" />
  ),
  music: (
    <>
      <path d="M9.4 17.6V6.2l10-2.2v11.4" />
      <circle cx="6.9" cy="17.8" r="2.6" />
      <circle cx="16.9" cy="15.6" r="2.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.3 5.3 7 7M17 17l1.7 1.7M18.7 5.3 17 7M7 17l-1.7 1.7" />
    </>
  ),

  // ─── Journal stamps ───────────────────────────────────────────────────────
  rainbow: (
    <>
      <path d="M3.4 18.4a8.6 8.6 0 0 1 17.2 0" />
      <path d="M7 18.4a5 5 0 0 1 10 0" />
      <path d="M10.6 18.4a1.4 1.4 0 0 1 2.8 0" />
    </>
  ),
  bloom: (
    <>
      <circle cx="12" cy="7" r="3" />
      <circle cx="16.7" cy="10.2" r="3" />
      <circle cx="15.1" cy="15.4" r="3" />
      <circle cx="8.9" cy="15.4" r="3" />
      <circle cx="7.3" cy="10.2" r="3" />
      <circle cx="12" cy="11.2" r="1.5" />
    </>
  ),
  butterfly: (
    <>
      <path d="M11.6 11.4C9.5 7.4 6 6.9 4.8 8.9s.3 5 3.3 4.8 3.5-2.3 3.5-2.3Z" />
      <path d="M12.4 11.4c2.1-4 5.6-4.5 6.8-2.5s-.3 5-3.3 4.8-3.5-2.3-3.5-2.3Z" />
      <path d="M11.7 12.6c-1.7-.2-5.1-.4-6.1 1.6s1.2 4.6 3.4 3.6 2.7-5.2 2.7-5.2Z" />
      <path d="M12.3 12.6c1.7-.2 5.1-.4 6.1 1.6s-1.2 4.6-3.4 3.6-2.7-5.2-2.7-5.2Z" />
      <path d="M12 8.4v8.4M12 8.4 10.3 6.3M12 8.4l1.7-2.1" />
    </>
  ),
  sparkle: (
    <>
      <path d="m9.8 3.4 1.4 3.7 3.7 1.4-3.7 1.4-1.4 3.7-1.4-3.7L4.7 8.5l3.7-1.4Z" />
      <path d="m17.2 13.6.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z" />
    </>
  ),
  hibiscus: (
    <>
      <circle cx="12" cy="7.4" r="3" />
      <circle cx="7.4" cy="12.6" r="3" />
      <circle cx="16.6" cy="12.6" r="3" />
      <circle cx="12" cy="13.4" r="2.8" />
    </>
  ),
  shell: (
    <>
      <path d="M4 17.2c0-5 3.6-9 8-9s8 4 8 9Z" />
      <path d="M12 8.2v9M8.4 8.8 7.2 17.2M15.6 8.8l1.2 8.4" />
      <path d="M3.4 17.2h17.2" />
    </>
  ),
  sunflower: (
    <>
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path
            key={deg}
            transform={`rotate(${deg} 12 12)`}
            d="M12 7.4c-1 1.2-1.7 1.7-1.7 2.8a1.7 1.7 0 0 0 3.4 0c0-1.1-.7-1.6-1.7-2.8Z"
          />
        ))}
      </g>
      <circle cx="12" cy="12" r="2.9" />
    </>
  ),

  // ─── Shop ─────────────────────────────────────────────────────────────────
  hat: (
    <>
      <path d="M3.2 9.6h17.6" />
      <path d="M7 9.6V5.8a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.8" />
      <path d="M7 8.2h10" />
    </>
  ),
  crown: (
    <>
      <path d="M4 18.4h16" />
      <path d="m4 18.4-1-9.4 5 3.6L12 4.8l4 7.8 5-3.6-1 9.4" />
    </>
  ),
  bow: (
    <>
      <path d="M11 12 4.2 7.4v9.2Z" />
      <path d="m13 12 6.8-4.6v9.2Z" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  starfield: (
    <>
      <path d="m8.6 3.6 1.2 3.3 3.3 1.2-3.3 1.2-1.2 3.3-1.2-3.3L4.1 8.1l3.3-1.2Z" />
      <path d="m16.8 11.4.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
      <path d="m18.4 3.4.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6Z" />
    </>
  ),
  petals: (
    <>
      <path
        transform="rotate(-20 7 7.8)"
        d="M7 4.6c1.8 0 2.8 1.5 2.8 3.2S8.8 11 7 11 4.2 9.5 4.2 7.8 5.2 4.6 7 4.6Z"
      />
      <path
        transform="rotate(25 14 12)"
        d="M14 9.2c1.6 0 2.5 1.3 2.5 2.8s-.9 2.8-2.5 2.8-2.5-1.3-2.5-2.8 1-2.8 2.5-2.8Z"
      />
      <path
        transform="rotate(-12 17 6.4)"
        d="M17 4.2c1.2 0 1.9 1 1.9 2.2s-.7 2.2-1.9 2.2-1.9-1-1.9-2.2.7-2.2 1.9-2.2Z"
      />
    </>
  ),

  // ─── Stats and UI ─────────────────────────────────────────────────────────
  flame: (
    <path d="M12 20.8a4.8 4.8 0 0 0 4.8-4.8c0-3.4-3-5.2-4-9.2-1.6 2.6-1 4-2 5.2S8 14.6 8 16a4 4 0 0 0 4 4.8Z" />
  ),
  trophy: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
      <path d="M8 5.6H5.6A2.6 2.6 0 0 0 8.2 10M16 5.6h2.4A2.6 2.6 0 0 1 15.8 10" />
      <path d="M12 13v3.4M9 20.4h6M9.6 16.8h4.8v3.6H9.6Z" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="7.6" />
      <path d="M12 7.6v8.8M9.6 10h3.2a1.6 1.6 0 0 1 0 3.2H9.6h3.4a1.6 1.6 0 0 1 0 3.2H9.6" />
    </>
  ),
  check: <path d="m5 12.8 4.8 4.7L19 7.5" />,
  arrowLeft: <path d="M19 12H5M11 6 5 12l6 6" />,
  close: <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />,
  sparkSmall: <path d="M12 4.4 13.3 9 17.8 10.3 13.3 11.6 12 16.2 10.7 11.6 6.2 10.3 10.7 9Z" />,
}

export interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
}

export function Icon({ name, size = 22, strokeWidth = 1.75, className, style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name]}
    </svg>
  )
}

/** A coin amount, used wherever the old coin glyph used to sit. */
export function CoinAmount({
  value,
  size = 18,
  tone = "accent",
}: {
  value: number
  size?: number
  tone?: "accent" | "primary" | "paper"
}) {
  const color =
    tone === "primary" ? "var(--primary-ink)" : tone === "paper" ? "#fff" : "var(--accent-ink)"
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color }}>
      <Icon name="coin" size={size} strokeWidth={1.6} />
      <span style={{ fontWeight: 800 }}>{value}</span>
    </span>
  )
}
