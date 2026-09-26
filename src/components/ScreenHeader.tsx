import type { ReactNode } from "react"

interface ScreenHeaderProps {
  title: string
  subtitle?: string
  tint?: string
  icon?: ReactNode
  aside?: ReactNode
}

export function ScreenHeader({ title, subtitle, tint, icon, aside }: ScreenHeaderProps) {
  return (
    <header
      style={{
        background: tint,
        padding: "calc(var(--pad) * 0.85) var(--pad)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        {icon}
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(20px, 3vw, 26px)",
              color: "var(--text)",
              lineHeight: 1.15,
              // Companion names are user input: 24 characters at 26px overflows a
              // 320px phone, and the overflow took the whole page sideways.
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontSize: 13,
                color: "var(--text-light)",
                marginTop: 2,
                textTransform: "capitalize",
                overflowWrap: "anywhere",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {aside}
    </header>
  )
}
