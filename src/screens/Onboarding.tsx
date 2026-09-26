import { useState } from "react"
import { Companion } from "@/components/Companion"
import { Icon } from "@/components/icons"

interface OnboardingProps {
  onDone: (userName: string, companionName: string) => void
}

export function OnboardingScreen({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [userName, setUserName] = useState("")
  const [companionName, setCompanionName] = useState("")

  const userReady = userName.trim().length > 0
  const companionReady = companionName.trim().length > 0

  return (
    <div
      className="rise-in"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(160deg, #fff8f0 0%, #ffe8d6 42%, #e6f2f3 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Vertical centring only bites when the viewport is taller than the form,
        // and `min-height` (not `height`) means the box grows instead of clipping.
        justifyContent: "center",
        // No horizontal padding here: the clipping layer below has to reach the
        // viewport edge, and the column carries `--pad` on its own.
        padding: "clamp(24px, 6vw, 56px) 0 clamp(28px, 6vw, 56px)",
        position: "relative",
      }}
    >
      {/* The blobs bleed off the edges, so they need a clipper — but not the root:
          `overflow: hidden` on a `min-height: 100dvh` box is a scroll trap, and
          anything taller than the viewport becomes unreachable. Its own layer
          clips them and, being `pointer-events: none`, never eats a wheel event. */}
      <span
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
      >
        <span
          style={{
            position: "absolute",
            top: -70,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(168, 218, 220, 0.22)",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: 60,
            left: -90,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(255, 181, 167, 0.18)",
          }}
        />
      </span>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          padding: "0 var(--pad)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 5vw, 32px)",
            color: "var(--text)",
          }}
        >
          Mood Memoir
        </p>
        <p style={{ fontSize: 13, color: "var(--text-light)", marginTop: 6 }}>
          Un diario de ánimo que crece contigo
        </p>

        {/* Step dots */}
        <div
          style={{ display: "flex", gap: 8, justifyContent: "center", margin: "22px 0 6px" }}
          aria-hidden="true"
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              style={{
                width: i === step ? 22 : 8,
                height: 8,
                borderRadius: 999,
                background: i <= step ? "var(--primary)" : "rgba(61,64,91,0.15)",
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>

        <div
          className="float-anim"
          style={{ margin: "10px 0 18px", display: "flex", justifyContent: "center" }}
        >
          {step === 0 ? <Egg /> : <Companion mood={null} level={1} size={148} />}
        </div>

        {step === 0 ? (
          <div className="rise-in" key="step-0">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 21,
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              Hay un huevo sin eclosionar
            </h2>
            <p
              style={{
                fontFamily: "var(--font-journal)",
                fontSize: 15,
                color: "var(--text-light)",
                lineHeight: 1.7,
                marginBottom: 26,
              }}
            >
              Dentro vive una criatura pequeña que crece con tus cuidados. Cuídate, escríbete,
              y mírala florecer.
            </p>

            <div style={{ textAlign: "left", marginBottom: 18 }}>
              <label className="field-label" htmlFor="user-name" style={{ display: "block", marginBottom: 8 }}>
                ¿Cómo te llamas tú?
              </label>
              <input
                id="user-name"
                className="field"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && userReady) setStep(1)
                }}
                placeholder="Tu nombre"
                maxLength={24}
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={!userReady}
              onClick={() => setStep(1)}
            >
              Ver qué hay dentro
              <Icon name="arrowLeft" size={18} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
        ) : (
          <div className="rise-in" key="step-1">
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 21,
                color: "var(--text)",
                marginBottom: 10,
              }}
            >
              Hola, {userName.trim()}
            </h2>
            <p
              style={{
                fontFamily: "var(--font-journal)",
                fontSize: 15,
                color: "var(--text-light)",
                lineHeight: 1.7,
                marginBottom: 26,
              }}
            >
              Salió del huevo y te está mirando. Dale un nombre: es la primera cosa que va a
              aprender de ti.
            </p>

            <div style={{ textAlign: "left", marginBottom: 18 }}>
              <label
                className="field-label"
                htmlFor="companion-name"
                style={{ display: "block", marginBottom: 8 }}
              >
                ¿Cómo se llama tu compañero?
              </label>
              <input
                id="companion-name"
                className="field"
                value={companionName}
                onChange={(event) => setCompanionName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && companionReady) onDone(userName, companionName)
                }}
                placeholder="Lumis, Mochi, Taro..."
                maxLength={24}
                autoComplete="off"
              />
              <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 8 }}>
                Puedes cambiarlo después desde la tienda.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                Atrás
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={!companionReady}
                onClick={() => onDone(userName, companionName)}
              >
                Empezar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** The un-hatched egg, with a crack that widens as you get further along. */
function Egg() {
  return (
    <svg width="150" height="168" viewBox="0 0 140 160" role="img" aria-label="Un huevo con una grieta">
      <defs>
        <radialGradient id="egg-shell" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#fff6e6" />
          <stop offset="100%" stopColor="#ffd6a5" />
        </radialGradient>
      </defs>
      <ellipse cx="70" cy="148" rx="38" ry="8" fill="rgba(255,181,167,0.3)" />
      <ellipse cx="70" cy="88" rx="50" ry="60" fill="url(#egg-shell)" />
      <g fill="#f0b98a" opacity="0.5">
        <ellipse cx="52" cy="70" rx="4" ry="3" />
        <ellipse cx="86" cy="96" rx="3" ry="2.4" />
        <ellipse cx="66" cy="112" rx="3.4" ry="2.6" />
        <ellipse cx="92" cy="62" rx="2.6" ry="2" />
      </g>
      <path
        d="M56 66 63 78 56 88 66 100"
        stroke="#e8a06a"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M63 78 72 82" stroke="#e8a06a" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <g fill="#e8b04b" opacity="0.85">
        <path d="m30 62 1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6Z" />
        <path d="m106 84 1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" />
        <path d="m44 36 1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
      </g>
    </svg>
  )
}
