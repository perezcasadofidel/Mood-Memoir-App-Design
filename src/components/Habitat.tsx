import type { CSSProperties } from "react"
import { Companion } from "@/components/Companion"
import { Icon } from "@/components/icons"
import { MOOD_BY_ID } from "@/data"
import { seeded } from "@/lib/random"
import { DEFAULT_HABITAT, type Mood } from "@/types"

interface Theme {
  label: string
  sky: string
  ground: string
  hill: string
  cloud: string
  star: boolean
  moon: boolean
  detail: string
}

const THEMES: Record<string, Theme> = {
  [DEFAULT_HABITAT]: {
    label: "Pradera",
    sky: "linear-gradient(180deg, #c8ebf0 0%, #eaf6f5 55%, #dcecc0 100%)",
    ground: "linear-gradient(0deg, #a6d77d 0%, #cbe9a2 100%)",
    hill: "rgba(160, 200, 130, 0.45)",
    cloud: "#ffffff",
    star: false,
    moon: false,
    detail: "#ffb5a7",
  },
  bg_star: {
    label: "Cielo estrellado",
    sky: "linear-gradient(180deg, #232c52 0%, #3a4776 58%, #565c8c 100%)",
    ground: "linear-gradient(0deg, #343b66 0%, #545c8b 100%)",
    hill: "rgba(90, 100, 150, 0.5)",
    cloud: "#93a0d4",
    star: true,
    moon: false,
    detail: "#e3e0ff",
  },
  bg_moon: {
    label: "Jardín lunar",
    sky: "linear-gradient(180deg, #1b2542 0%, #2f3c64 55%, #465785 100%)",
    ground: "linear-gradient(0deg, #35565f 0%, #587e83 100%)",
    hill: "rgba(80, 120, 125, 0.5)",
    cloud: "#c8d4ea",
    star: true,
    moon: true,
    detail: "#d7e6ef",
  },
}

export const habitatLabel = (id: string): string => THEMES[id]?.label ?? THEMES[DEFAULT_HABITAT].label

const rand = seeded(20260926)

const STARS = Array.from({ length: 24 }, () => ({
  left: rand() * 100,
  top: rand() * 62,
  size: 1.1 + rand() * 1.5,
  opacity: 0.35 + rand() * 0.6,
}))

const PETALS = Array.from({ length: 14 }, () => ({
  left: rand() * 100,
  delay: rand() * 9,
  duration: 7 + rand() * 7,
  size: 8 + rand() * 7,
  drift: 30 + rand() * 50,
  color: ["#ffb5a7", "#ffd6a5", "#f7a8b8", "#ffe4e1"][Math.floor(rand() * 4)],
}))

interface HabitatProps {
  mood: Mood
  level: number
  companionName: string
  accessory: string | null
  habitat: string
  petals: boolean
  /** Hide the name plate when the companion is already named in a header. */
  showName?: boolean
}

export function Habitat({
  mood,
  level,
  companionName,
  accessory,
  habitat,
  petals,
  showName = true,
}: HabitatProps) {
  const theme = THEMES[habitat] ?? THEMES[DEFAULT_HABITAT]
  const moodOption = mood ? MOOD_BY_ID[mood] : null
  const fallingPetals = petals ? PETALS : []

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius)",
        height: "clamp(210px, 32vw, 300px)",
        background: theme.sky,
        border: "1px solid var(--card-border)",
        boxShadow: "var(--shadow-card)",
        isolation: "isolate",
      }}
    >
      {theme.star &&
        STARS.map((star, i) => (
          <span
            key={i}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              background: "#fff",
              opacity: star.opacity,
            }}
          />
        ))}

      {theme.moon && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 18,
            right: 28,
            width: 46,
            height: 46,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 32%, #fffdf2, #e7e2c4 70%, #d6d2b6)",
            boxShadow: "0 0 32px rgba(255, 253, 240, 0.5)",
          }}
        />
      )}

      {/* Clouds */}
      <Cloud style={{ top: 16, left: "12%" }} color={theme.cloud} scale={1} />
      <Cloud style={{ top: 30, right: "16%" }} color={theme.cloud} scale={0.7} />

      {/* Distant hills */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 52,
          left: "-10%",
          width: "60%",
          height: 90,
          borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
          background: theme.hill,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 48,
          right: "-12%",
          width: "55%",
          height: 80,
          borderRadius: "50% 50% 0 0 / 60% 60% 0 0",
          background: theme.hill,
        }}
      />

      {/* Ground */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 62,
          background: theme.ground,
          borderRadius: "58% 58% 0 0 / 34% 34% 0 0",
        }}
      />

      {/* Grass and flowers */}
      <GrassDetail left="14%" color={theme.detail} />
      <GrassDetail left="34%" color={theme.detail} scale={0.8} />
      <GrassDetail left="72%" color={theme.detail} scale={0.9} />
      <GrassDetail left="88%" color={theme.detail} scale={0.75} />

      {/* Petals drift in front of everything */}
      {fallingPetals.map((petal, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={
            {
              position: "absolute",
              top: 0,
              left: `${petal.left}%`,
              width: petal.size,
              height: petal.size * 0.72,
              background: petal.color,
              borderRadius: "60% 40% 55% 45%",
              animation: `petal-fall ${petal.duration}s ${petal.delay}s linear infinite`,
              "--drift": `${petal.drift}px`,
              opacity: 0.85,
            } as CSSProperties
          }
        />
      ))}

      {/* Companion */}
      <div
        className="bob-anim"
        style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)" }}
      >
        <Companion mood={mood} level={level} size={132} accessory={accessory} />
      </div>

      {moodOption && (
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 20,
            background: "rgba(255,255,255,0.86)",
            fontSize: 12,
            fontWeight: 800,
            color: "var(--text)",
          }}
        >
          <Icon name={moodOption.icon} size={15} />
          {moodOption.label}
        </span>
      )}

      {showName && (
        <span
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.9)",
            borderRadius: 20,
            padding: "3px 14px",
            fontSize: 12,
            fontWeight: 800,
            color: "var(--text)",
            whiteSpace: "nowrap",
          }}
        >
          {companionName}
        </span>
      )}
    </div>
  )
}

function Cloud({ style, color, scale }: { style: CSSProperties; color: string; scale: number }) {
  return (
    <span
      aria-hidden="true"
        style={{
          ...style,
          position: "absolute",
          width: 64,
          height: 22,
          background: color,
          opacity: 0.55,
          borderRadius: 999,
          transform: `scale(${scale})`,
        }}
    >
      <span
        style={{
          position: "absolute",
          left: "18%",
          top: "-58%",
          width: "38%",
          height: "100%",
          borderRadius: 999,
          background: color,
        }}
      />
      <span
        style={{
          position: "absolute",
          right: "20%",
          top: "-40%",
          width: "30%",
          height: "90%",
          borderRadius: 999,
          background: color,
        }}
      />
    </span>
  )
}

function GrassDetail({
  left,
  color,
  scale = 1,
}: {
  left: string
  color: string
  scale?: number
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: 18,
        left,
        width: 26 * scale,
        height: 26 * scale,
        transform: `scale(${scale})`,
      }}
    >
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke={color} strokeWidth="1.8">
        <path d="M13 24V13" strokeLinecap="round" />
        <path d="M13 13c0-3.2-2-5.4-5-5.4 0 3.2 2 5.4 5 5.4Z" strokeLinejoin="round" />
        <path d="M13 13c0-3.8 2.6-6.4 6-6.4 0 3.8-2.6 6.4-6 6.4Z" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
