import { useEffect, useState } from "react"
import { seeded } from "@/lib/random"

const COLORS = ["#ffb5a7", "#f4a261", "#a8dadc", "#ffd6a5", "#c0eaf1", "#ffe4e1"]

interface Piece {
  left: number
  delay: number
  size: number
  round: boolean
  color: string
}

/**
 * Celebration burst. Mount it while something worth celebrating just happened;
 * the caller owns the lifetime, so there is no timer to leak.
 */
export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (!active) {
      setPieces([])
      return
    }
    const rand = seeded(Date.now() % 2147483647)
    setPieces(
      Array.from({ length: 22 }, (_, i) => ({
        left: rand() * 100,
        delay: rand() * 0.45,
        size: 6 + rand() * 8,
        round: rand() > 0.5,
        color: COLORS[i % COLORS.length],
      })),
    )
  }, [active])

  if (!active || pieces.length === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 60,
      }}
    >
      {pieces.map((piece, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${piece.left}%`,
            top: -12,
            width: piece.size,
            height: piece.size,
            background: piece.color,
            borderRadius: piece.round ? "50%" : "2px",
            animation: `confetti-fall 1.4s ${piece.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}
