import { ScreenHeader } from "@/components/ScreenHeader"
import { habitatLabel, Habitat } from "@/components/Habitat"
import { CoinAmount, Icon } from "@/components/icons"
import { MOODS } from "@/data"
import { formatLongDate } from "@/lib/date"
import type { Game } from "@/state/useGame"
import type { Feedback } from "@/state/useFeedback"
import type { MissionId, MoodId, Screen } from "@/types"

interface HomeProps {
  game: Game
  feedback: Feedback
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ game, feedback, onNavigate }: HomeProps) {
  const { state, today, todayEntry, todayMissions, todayCompleted } = game
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Buenos días" : hour < 20 ? "Buenas tardes" : "Buenas noches"
  const firstName = state.userName.trim().split(" ")[0]
  const mood = todayEntry?.mood ?? null
  const doneCount = todayCompleted.length

  function handleMood(id: MoodId) {
    game.dispatch({ type: "set-mood", today, mood: id })
    if (id === "joyful") {
      feedback.celebrate()
      feedback.show("Guardado. Buen momento para anotarlo en el diario")
    } else {
      feedback.show(`Ánimo registrado: ${MOODS.find((m) => m.id === id)?.label}`)
    }
  }

  function handleMission(id: MissionId, coins: number) {
    if (todayCompleted.includes(id)) return
    game.dispatch({ type: "complete-mission", today, id })
    feedback.celebrate()
    feedback.show(`Misión completada. +${coins} monedas`)
  }

  return (
    <div className="screen">
      <ScreenHeader
        title={`${greeting}${firstName ? `, ${firstName}` : ""}`}
        subtitle={`Nivel ${game.level} · ${state.companionName} te espera`}
        tint="linear-gradient(135deg, #fff0e6, #ffe6d4)"
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
            <Icon name="home" size={21} />
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
        <div className="grid-home">
          {/* ── Column one: the companion and today's check-in ── */}
          <div className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <Habitat
              mood={mood}
              level={game.level}
              companionName={state.companionName}
              accessory={state.equippedAccessory}
              habitat={state.equippedHabitat}
              petals={game.hasPetals}
            />

            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="checkin-title">
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
                  id="checkin-title"
                  style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text)" }}
                >
                  ¿Cómo te sientes hoy?
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                  {mood ? "Puedes cambiarlo" : "Elige una"}
                </span>
              </div>

              <div className="grid-moods">
                {MOODS.map((option) => {
                  const selected = mood === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      className="mood-tile"
                      aria-pressed={selected}
                      onClick={() => handleMood(option.id)}
                      style={selected ? { background: option.color } : undefined}
                    >
                      <span style={{ color: selected ? "var(--text)" : "var(--text-light)" }}>
                        <Icon name={option.icon} size={22} />
                      </span>
                      <span className="mood-tile-label">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ── Column two: missions and today's page ── */}
          <div className="stack" style={{ gap: "var(--gap)", alignContent: "start" }}>
            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="missions-title">
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 4,
                }}
              >
                <h2
                  id="missions-title"
                  style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text)" }}
                >
                  Misiones de hoy
                </h2>
                <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                  {doneCount} de {todayMissions.length}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 14 }}>
                Se renuevan cada mañana. Márcalas cuando las hagas.
              </p>

              <div
                style={{
                  height: 6,
                  borderRadius: 999,
                  background: "rgba(61,64,91,0.08)",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(doneCount / Math.max(todayMissions.length, 1)) * 100}%`,
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #ffb5a7, #f4a261)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              <ul className="stack" style={{ gap: 10 }}>
                {todayMissions.map((mission) => {
                  const done = todayCompleted.includes(mission.id)
                  return (
                    <li
                      key={mission.id}
                      className="card-quiet"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        opacity: done ? 0.6 : 1,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          background: done ? "rgba(143,191,110,0.2)" : "var(--primary-soft)",
                          color: done ? "#4f7a33" : "var(--primary-ink)",
                        }}
                      >
                        <Icon name={done ? "check" : mission.icon} size={19} />
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: "block",
                            fontWeight: 700,
                            fontSize: 14,
                            color: "var(--text)",
                            textDecoration: done ? "line-through" : "none",
                          }}
                        >
                          {mission.text}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                          +{mission.coins} monedas
                          {mission.auto && !done ? " · se marca sola al escribir" : ""}
                        </span>
                      </span>
                      {!done && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleMission(mission.id, mission.coins)}
                          style={{ padding: "8px 14px", fontSize: 12, flexShrink: 0 }}
                        >
                          Hecha
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="card" style={{ padding: "var(--pad)" }} aria-labelledby="today-title">
              <h2
                id="today-title"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {formatLongDate(today)}
              </h2>
              {todayEntry && todayEntry.text.trim().length > 0 ? (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-journal)",
                      fontSize: 14,
                      color: "var(--text-light)",
                      lineHeight: 1.7,
                      marginBottom: 14,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {todayEntry.text}
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onNavigate("journal")}
                    style={{ padding: "9px 16px", fontSize: 13 }}
                  >
                    Seguir escribiendo
                  </button>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: "var(--font-journal)",
                      fontSize: 14,
                      color: "var(--text-light)",
                      lineHeight: 1.7,
                      marginBottom: 14,
                    }}
                  >
                    {mood
                      ? `Ya registraste que te sientes ${MOODS.find((m) => m.id === mood)?.label.toLowerCase()}. Falta la parte difícil: escribirlo.`
                      : "Aún no hay nada escrito hoy. Con una frase basta."}
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onNavigate("journal")}
                    style={{ padding: "10px 18px", fontSize: 14 }}
                  >
                    Escribir en el diario
                  </button>
                </>
              )}
              <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 12 }}>
                {habitatLabel(state.equippedHabitat)} · {state.companionName} nivel {game.level}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
