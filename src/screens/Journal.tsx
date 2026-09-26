import { useEffect, useMemo, useRef, useState } from "react"
import { ScreenHeader } from "@/components/ScreenHeader"
import { Icon } from "@/components/icons"
import { MOOD_BY_ID, MOODS, PROMPTS, STAMPS } from "@/data"
import { formatLongDate, formatShortDate, hashString } from "@/lib/date"
import type { Feedback } from "@/state/useFeedback"
import type { Game } from "@/state/useGame"
import type { MoodId } from "@/types"

interface JournalProps {
  game: Game
  feedback: Feedback
  /** Date pre-selected by the progress calendar, if any. */
  requestedDate: string | null
  onRequestedDateHandled: () => void
}

/** The prompt is a function of the date, so reopening the journal keeps it. */
const promptFor = (date: string): string => PROMPTS[hashString(`prompt:${date}`) % PROMPTS.length]

export function JournalScreen({
  game,
  feedback,
  requestedDate,
  onRequestedDateHandled,
}: JournalProps) {
  const { state, today, todayEntry } = game
  const [date, setDate] = useState(today)
  const [text, setText] = useState(todayEntry?.text ?? "")
  const [stamp, setStamp] = useState<string | null>(todayEntry?.stamp ?? null)
  const [mood, setMood] = useState<MoodId>(todayEntry?.mood ?? "meh")

  // A date tapped in the progress calendar loads that page, once per tap.
  const handledDate = useRef<string | null>(null)
  useEffect(() => {
    if (requestedDate === null) {
      handledDate.current = null
      return
    }
    if (handledDate.current === requestedDate) return
    handledDate.current = requestedDate
    setDate(requestedDate)
    onRequestedDateHandled()
  }, [requestedDate, onRequestedDateHandled])

  const entry = useMemo(
    () => state.entries.find((item) => item.date === date) ?? null,
    [state.entries, date],
  )

  // Load whatever is stored for the selected day, once per selection.
  useEffect(() => {
    if (entry === null) {
      setText("")
      setStamp(null)
      setMood("meh")
      return
    }
    setText(entry.text)
    setStamp(entry.stamp)
    setMood(entry.mood)
  }, [entry])

  const prompt = entry?.prompt || promptFor(date)
  const isToday = date === today
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length
  const canSave = text.trim().length > 0
  const history = [...state.entries].reverse().filter((item) => item.text.trim().length > 0)

  function handleSave() {
    if (!canSave) return
    game.dispatch({ type: "save-entry", today, date, mood, text, stamp, prompt })
    feedback.show(isToday ? "Página guardada" : `Página del ${formatShortDate(date)} guardada`)
    if (isToday) feedback.celebrate()
  }

  return (
    <div className="screen">
      <ScreenHeader
        title="Mi diario"
        subtitle={formatLongDate(date)}
        tint="linear-gradient(135deg, #fff0e6, #ffecd2)"
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
            <Icon name="book" size={21} />
          </span>
        }
        aside={
          !isToday ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setDate(today)}
              style={{ padding: "8px 14px", fontSize: 13 }}
            >
              <Icon name="arrowLeft" size={15} />
              Volver a hoy
            </button>
          ) : undefined
        }
      />

      <div className="screen-pad screen-body">
        <div className="grid-split">
          {/* ── Column one: the page being written ── */}
          <div className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <section
              className="card"
              style={{
                padding: "clamp(16px, 3vw, 24px)",
                background: "linear-gradient(160deg, #fffbf5 0%, #fff8ee 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute",
                      left: 52,
                      right: 0,
                      top: 96 + i * 34,
                      height: 1,
                      background: "rgba(168, 218, 220, 0.32)",
                    }}
                  />
                ))}
                <span
                  style={{
                    position: "absolute",
                    left: 44,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    background: "rgba(255, 181, 167, 0.45)",
                  }}
                />
              </div>

              <p
                style={{
                  fontFamily: "var(--font-journal)",
                  fontStyle: "italic",
                  fontSize: 14,
                  color: "var(--text-light)",
                  marginBottom: 10,
                  paddingLeft: 40,
                  position: "relative",
                }}
              >
                {prompt}
              </p>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Escribe lo que tengas en la cabeza. Nadie más lo va a leer."
                aria-label="Texto de la entrada"
                style={{
                  width: "100%",
                  minHeight: 220,
                  border: "none",
                  background: "transparent",
                  fontFamily: "var(--font-journal)",
                  fontSize: 15,
                  color: "var(--text)",
                  lineHeight: 2,
                  resize: "vertical",
                  outline: "none",
                  paddingLeft: 40,
                  position: "relative",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  paddingLeft: 40,
                  position: "relative",
                  fontSize: 12,
                  color: "var(--text-light)",
                }}
              >
                <span>
                  {words} {words === 1 ? "palabra" : "palabras"}
                </span>
                {entry !== null && <span>Página guardada</span>}
              </div>
            </section>

            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="mood-page">
              <h2
                id="mood-page"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  color: "var(--text)",
                  marginBottom: 12,
                }}
              >
                ¿Cómo fue ese día?
              </h2>
              <div className="grid-moods">
                {MOODS.map((option) => {
                  const selected = mood === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="mood-tile"
                      aria-pressed={selected}
                      onClick={() => setMood(option.id)}
                      style={selected ? { background: option.color } : undefined}
                    >
                      <span style={{ color: selected ? "var(--text)" : "var(--text-light)" }}>
                        <Icon name={option.icon} size={20} />
                      </span>
                      <span className="mood-tile-label">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="stamp-title">
              <h2
                id="stamp-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                Un sello para la página
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 12 }}>
                Opcional. Sirve para acordarte de cómo se sintió el día.
              </p>
              <div className="scroller-x" style={{ margin: "0 -4px", padding: "0 4px 4px" }}>
                <div style={{ display: "flex", gap: 8, width: "max-content" }}>
                  {STAMPS.map((option) => {
                    const selected = stamp === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        className="stamp"
                        aria-pressed={selected}
                        aria-label={option.name}
                        title={option.name}
                        onClick={() => setStamp(selected ? null : option.id)}
                        style={selected ? { color: option.color } : undefined}
                      >
                        <Icon name={option.icon} size={24} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!canSave}
                style={{ flex: 1, fontSize: 15 }}
              >
                <Icon name="check" size={18} />
                {entry !== null ? "Guardar los cambios" : "Guardar la página"}
              </button>
              {stamp !== null && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStamp(null)}
                  aria-label="Quitar el sello"
                  style={{ padding: 13 }}
                >
                  <Icon name="close" size={18} />
                </button>
              )}
            </div>
          </div>

          {/* ── Column two: everything written so far ── */}
          <aside className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="history-title">
              <h2
                id="history-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                Páginas anteriores
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 14 }}>
                {history.length === 0
                  ? "Todavía no hay nada escrito. La de hoy puede ser la primera."
                  : `${history.length} ${history.length === 1 ? "página guardada" : "páginas guardadas"}`}
              </p>

              {history.length === 0 ? (
                <p
                  style={{
                    fontFamily: "var(--font-journal)",
                    fontStyle: "italic",
                    fontSize: 14,
                    color: "var(--text-light)",
                    lineHeight: 1.7,
                  }}
                >
                  No hace falta escribir bonito ni mucho. Una línea basta para que el día quede
                  registrado.
                </p>
              ) : (
                <ul className="stack" style={{ gap: 8 }}>
                  {history.map((item) => {
                    const option = MOOD_BY_ID[item.mood]
                    const active = item.date === date
                    return (
                      <li key={item.date} style={{ minWidth: 0 }}>
                        <button
                          type="button"
                          onClick={() => setDate(item.date)}
                          aria-current={active ? "true" : undefined}
                          className="card-quiet"
                          style={{
                            width: "100%",
                            minWidth: 0,
                            textAlign: "left",
                            padding: "11px 13px",
                            display: "flex",
                            gap: 11,
                            alignItems: "flex-start",
                            border: active ? "1px solid var(--primary-dark)" : "1px solid var(--line)",
                            background: active ? "var(--primary-soft)" : "transparent",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 30,
                              height: 30,
                              flexShrink: 0,
                              borderRadius: 10,
                              display: "grid",
                              placeItems: "center",
                              background: option.color,
                              color: "var(--text)",
                            }}
                          >
                            <Icon name={option.icon} size={16} />
                          </span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span
                              style={{
                                display: "block",
                                fontSize: 12,
                                fontWeight: 800,
                                color: "var(--text)",
                              }}
                            >
                              {formatShortDate(item.date)}
                            </span>
                            <span
                              style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontFamily: "var(--font-journal)",
                                fontSize: 13,
                                color: "var(--text-light)",
                                lineHeight: 1.5,
                                marginTop: 2,
                                // Free-form text: a single long word would otherwise
                                // set the min-content floor of the whole column.
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.text}
                            </span>
                          </span>
                          {item.stamp !== null && (
                            <span style={{ color: "var(--text-light)", flexShrink: 0 }}>
                              <Icon
                                name={STAMPS.find((s) => s.id === item.stamp)?.icon ?? "sparkSmall"}
                                size={16}
                              />
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            <section
              className="card-quiet"
              style={{ padding: "var(--pad)", fontFamily: "var(--font-journal)", fontSize: 14 }}
            >
              <p style={{ color: "var(--text-light)", lineHeight: 1.75 }}>
                Lo que escribas se queda en este dispositivo. {state.companionName} lo lee contigo:
                cada página y cada misión suman experiencia, y a partir de 100 xp sube de nivel.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
