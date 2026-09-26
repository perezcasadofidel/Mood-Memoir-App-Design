import { MOOD_BY_ID } from "@/data"
import type { Mood } from "@/types"

interface CompanionProps {
  mood: Mood
  level: number
  size?: number
  accessory?: string | null
  className?: string
}

const NEUTRAL = "#ffd6a5"

/** Level 1 sits at 74% of the box, level 8 fills it. */
function growthScale(level: number): number {
  return Math.min(0.74 + (level - 1) * 0.06, 1.2)
}

export function Companion({
  mood,
  level,
  size = 130,
  accessory = null,
  className,
}: CompanionProps) {
  const body = mood ? MOOD_BY_ID[mood].color : NEUTRAL
  const outline = "#3d405b"
  const scale = growthScale(level)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={mood ? `Compañero, se siente ${MOOD_BY_ID[mood].label}` : "Tu compañero"}
    >
      <g transform={`translate(60 60) scale(${scale}) translate(-60 -60)`}>
        <ellipse cx="60" cy="110" rx="32" ry="7" fill="rgba(61,64,91,0.12)" />

        {/* Ears */}
        <ellipse cx="28" cy="36" rx="11" ry="16" fill={body} transform="rotate(-15 28 36)" />
        <ellipse cx="92" cy="36" rx="11" ry="16" fill={body} transform="rotate(15 92 36)" />
        <ellipse
          cx="28"
          cy="36"
          rx="6"
          ry="10"
          fill="#ff9f8e"
          opacity="0.45"
          transform="rotate(-15 28 36)"
        />
        <ellipse
          cx="92"
          cy="36"
          rx="6"
          ry="10"
          fill="#ff9f8e"
          opacity="0.45"
          transform="rotate(15 92 36)"
        />

        {/* Body */}
        <ellipse cx="60" cy="68" rx="38" ry="44" fill={body} />
        <ellipse cx="60" cy="74" rx="21" ry="24" fill="#fffdf9" opacity="0.5" />

        {/* Cheeks */}
        <ellipse cx="38" cy="65" rx="8" ry="5" fill="#ff9f8e" opacity="0.45" />
        <ellipse cx="82" cy="65" rx="8" ry="5" fill="#ff9f8e" opacity="0.45" />

        {/* Eyes */}
        {mood === "joyful" ? (
          <>
            <path d="M43.5 57q4.5-5 9 0" stroke={outline} strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M67.5 57q4.5-5 9 0" stroke={outline} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx="48" cy="56" rx="4.4" ry={mood === "sad" ? 4.8 : 4.4} fill={outline} />
            <ellipse cx="72" cy="56" rx="4.4" ry={mood === "sad" ? 4.8 : 4.4} fill={outline} />
            {mood !== "sad" && (
              <>
                <ellipse cx="49.6" cy="54.4" rx="1.5" ry="1.5" fill="#fff" />
                <ellipse cx="73.6" cy="54.4" rx="1.5" ry="1.5" fill="#fff" />
              </>
            )}
          </>
        )}

        {/* Brows: a small tilt reads as worry or sadness. */}
        {(mood === "sad" || mood === "anxious") && (
          <>
            <path
              d={mood === "sad" ? "M42.5 51.5q5.5 3 11 0" : "M42.5 49.5q5.5 4 11 0"}
              stroke={outline}
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={mood === "sad" ? "M66.5 51.5q5.5 3 11 0" : "M66.5 49.5q5.5 4 11 0"}
              stroke={outline}
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Mouth */}
        <path
          d={
            mood === "joyful"
              ? "M51 69q9 9 18 0"
              : mood === "sad"
                ? "M52 76q8-8 16 0"
                : mood === "meh"
                  ? "M53 72h14"
                  : mood === "anxious"
                    ? "M53 73q3.5-3 7 0t7 0"
                    : "M54 72q6 4 12 0"
          }
          stroke={outline}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sparkles, only on a genuinely good day. */}
        {mood === "joyful" && (
          <g fill="#e8b04b">
            <path d="m12 24 1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" />
            <path d="m104 20 1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" />
          </g>
        )}

        {/* Accessories */}
        {accessory === "hat" && (
          <g>
            <ellipse cx="60" cy="27" rx="28" ry="6" fill="#7c5cc4" />
            <path d="M45 27V11a4 4 0 0 1 4-4h22a4 4 0 0 1 4 4v16Z" fill="#7c5cc4" />
            <rect x="45" y="19" width="30" height="6" fill="#f4a261" />
            <circle cx="60" cy="12" r="3.5" fill="#ffd6a5" />
          </g>
        )}
        {accessory === "crown" && (
          <g>
            <path d="M40 27 41 12l8 6 11-11 11 11 8-6 1 15Z" fill="#e8b04b" />
            <circle cx="41" cy="11" r="2.6" fill="#ffb5a7" />
            <circle cx="60" cy="6" r="3" fill="#a8dadc" />
            <circle cx="79" cy="11" r="2.6" fill="#ffb5a7" />
            <rect x="40" y="24" width="40" height="4.5" rx="2" fill="#c9902f" />
          </g>
        )}
        {accessory === "bow" && (
          <g>
            <path d="M55 30q-11-9-12-1t12 3Z" fill="#ffb5a7" />
            <path d="M57 30q11-9 12-1t-12 3Z" fill="#ffb5a7" />
            <circle cx="56" cy="30" r="4" fill="#f4a261" />
          </g>
        )}
      </g>
    </svg>
  )
}
