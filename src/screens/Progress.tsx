import { useState } from "react"
import { Companion } from "@/components/Companion"
import { ScreenHeader } from "@/components/ScreenHeader"
import { CoinAmount, Icon } from "@/components/icons"
import { MOODS, moodColor } from "@/data"
import { buildCalendar, formatShortDate } from "@/lib/date"
import { XP_PER_LEVEL, type Game } from "@/state/useGame"
import type { MoodId } from "@/types"

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"]
const WEEKS = 4

interface ProgressProps {
  game: Game
  onOpenDate: (date: string) => void
  onReset: () => void
}

export function ProgressScreen({ game, onOpenDate, onReset }: ProgressProps) {
  const { state, today, level, progressPct, streak, entryCount, missionsDoneTotal } = game
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const calendar = buildCalendar(WEEKS, today)
  const moodOf = (iso: string): MoodId | null =>
    state.entries.find((entry) => entry.date === iso)?.mood ?? null

  const filledDays = calendar.days.filter((day) => moodOf(day.iso) !== null).length
  const selectedEntry = selected === null ? null : (moodOf(selected) ?? null)
  const latest = state.entries.length > 0 ? state.entries[state.entries.length - 1] : null

  const stats = [
    { label: "Racha", value: streak, unit: streak === 1 ? "día" : "días", icon: "flame" as const },
    {
      label: "Misiones",
      value: missionsDoneTotal,
      unit: missionsDoneTotal === 1 ? "hecha" : "hechas",
      icon: "trophy" as const,
    },
    {
      label: "Páginas",
      value: entryCount,
      unit: entryCount === 1 ? "escrita" : "escritas",
      icon: "book" as const,
    },
  ]

  return (
    <div className="screen">
      <ScreenHeader
        title={state.companionName}
        subtitle={`Nivel ${level} · ${companionSubtitle(state.equippedAccessory)}`}
        tint="linear-gradient(135deg, #e6f2f3, #c8ebf0)"
        icon={
          <span
            aria-hidden="true"
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.8)",
              color: "var(--primary-ink)",
              flexShrink: 0,
            }}
          >
            <Icon name="sprout" size={21} />
          </span>
        }
        aside={
          <div
            className="card-quiet"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}
          >
            <CoinAmount value={state.coins} size={17} />
          </div>
        }
      />

      <div className="screen-pad screen-body">
        <div className="grid-split">
          {/* ── Column one: the companion, the xp bar, the stats ── */}
          <div className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <section className="card" style={{ padding: "var(--pad)" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                <div className="float-anim" style={{ flexShrink: 0 }}>
                  <Companion
                    mood={latest?.mood ?? null}
                    level={level}
                    size={112}
                    accessory={state.equippedAccessory}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 190 }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      color: "var(--text)",
                    }}
                  >
                    {state.companionName}
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--text-light)", margin: "2px 0 14px" }}>
                    {latest
                      ? `Se siente ${MOODS.find((m) => m.id === latest.mood)?.label.toLowerCase()} desde tu última página`
                      : "Todavía no sabe cómo te sientes"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 11,
                      color: "var(--text-light)",
                      marginBottom: 5,
                    }}
                  >
                    <span>Experiencia para el nivel {level + 1}</span>
                    <span>
                      {game.xpIntoLevel}/{XP_PER_LEVEL}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={game.xpIntoLevel}
                    aria-valuemin={0}
                    aria-valuemax={XP_PER_LEVEL}
                    aria-label={`Experiencia para el nivel ${level + 1}`}
                    style={{
                      height: 10,
                      background: "rgba(61,64,91,0.08)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPct * 100}%`,
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #ffb5a7, #f4a261)",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 8 }}>
                    {state.xp} xp en total
                  </p>
                </div>
              </div>
            </section>

            <div className="grid-stats">
              {stats.map((stat) => (
                <section key={stat.label} className="card" style={{ padding: "16px 12px" }}>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: 34,
                      height: 34,
                      borderRadius: 12,
                      background: "var(--primary-soft)",
                      color: "var(--primary-ink)",
                      marginBottom: 8,
                    }}
                  >
                    <Icon name={stat.icon} size={18} />
                  </span>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      color: "var(--text)",
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                    <span style={{ fontSize: 12, fontFamily: "var(--font-body)" }}>
                      {" "}
                      {stat.unit}
                    </span>
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-light)" }}>{stat.label}</p>
                </section>
              ))}
            </div>

            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="tickets-title">
              <h2
                id="tickets-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                Cómo funciona la experiencia
              </h2>
              <ul
                className="stack"
                style={{ gap: 9, fontSize: 13, color: "var(--text-light)" }}
              >
                <ExperienceRow icon="spark" text="Registrar cómo te sientes: 5 xp" />
                <ExperienceRow icon="book" text="Escribir la página del día: 10 xp" />
                <ExperienceRow icon="coin" text="Cada misión: las mismas monedas y xp" />
              </ul>
              <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 12 }}>
                Cada {XP_PER_LEVEL} xp, {state.companionName} sube de nivel y crece un poco.
              </p>
            </section>
          </div>

          {/* ── Column two: the month that actually happened ── */}
          <div className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="calendar-title">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <h2
                  id="calendar-title"
                  style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text)" }}
                >
                  Últimas {WEEKS * 7} jornadas
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                  {filledDays} registradas
                </span>
              </div>

              <div className="calendar" style={{ marginBottom: 6 }}>
                {WEEKDAYS.map((day) => (
                  <div key={day} className="calendar-head" aria-hidden="true">
                    {day}
                  </div>
                ))}
              </div>

              <div className="calendar">
                {Array.from({ length: calendar.leading }, (_, i) => (
                  <span key={`pad-${i}`} aria-hidden="true" />
                ))}
                {calendar.days.map((day) => {
                  const mood = moodOf(day.iso)
                  return (
                    <button
                      key={day.iso}
                      type="button"
                      className="calendar-cell"
                      data-filled={mood !== null}
                      data-today={day.isToday}
                      data-selected={selected === day.iso}
                      disabled={mood === null}
                      style={{ background: moodColor(mood) }}
                      title={mood ? `${formatShortDate(day.iso)} · ${MOODS.find((m) => m.id === mood)?.label}` : formatShortDate(day.iso)}
                      aria-label={`${formatShortDate(day.iso)}${mood ? `, ${MOODS.find((m) => m.id === mood)?.label}` : ", sin registro"}`}
                      onClick={() => setSelected(day.iso)}
                    >
                      {day.dayOfMonth}
                    </button>
                  )
                })}
                {Array.from({ length: calendar.trailing }, (_, i) => (
                  <span key={`tail-${i}`} aria-hidden="true" />
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: "1px solid var(--line)",
                }}
              >
                {MOODS.map((option) => (
                  <span
                    key={option.id}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: option.color,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "var(--text-light)" }}>{option.label}</span>
                  </span>
                ))}
              </div>
            </section>

            {selected !== null && (
              <section className="card" style={{ padding: "var(--pad)" }} aria-live="polite">
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    color: "var(--text)",
                    marginBottom: 6,
                  }}
                >
                  {formatShortDate(selected)}
                </h2>
                {selectedEntry === null ? (
                  <p style={{ fontSize: 13, color: "var(--text-light)" }}>
                    Ese día no tiene registro.
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 14 }}>
                      Ánimo registrado: {MOODS.find((m) => m.id === selectedEntry)?.label}. Puedes
                      abrir esa página para volver a leerla.
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => onOpenDate(selected)}
                      style={{ padding: "9px 16px", fontSize: 13 }}
                    >
                      Ir al diario
                    </button>
                  </>
                )}
              </section>
            )}

            <section className="card-quiet" style={{ padding: "var(--pad)" }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                Empezar de cero
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-light)", lineHeight: 1.6, marginBottom: 12 }}>
                Borra las páginas, las monedas y los objetos guardados en este dispositivo. No se
                puede deshacer.
              </p>
              {confirmReset ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setConfirmReset(false)}
                    style={{ padding: "8px 14px", fontSize: 13 }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setConfirmReset(false)
                      onReset()
                    }}
                    style={{ padding: "8px 14px", fontSize: 13 }}
                  >
                    Sí, borrar todo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setConfirmReset(true)}
                  style={{ padding: "8px 14px", fontSize: 13 }}
                >
                  Reiniciar progreso
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExperienceRow({ icon, text }: { icon: "spark" | "book" | "coin"; text: string }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ color: "var(--accent-ink)", flexShrink: 0, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={17} />
      </span>
      {text}
    </li>
  )
}

function companionSubtitle(accessory: string | null): string {
  if (accessory === "crown") return "Con corona, y muy serio con ella"
  if (accessory === "hat") return "Con sombrero, siempre con una idea"
  if (accessory === "bow") return "Con lazo, imposible tomárselo en serio"
  return "Creciendo contigo, journaling a diario"
}
