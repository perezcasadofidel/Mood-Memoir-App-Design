import { useCallback, useEffect, useRef, useState } from "react"
import { Confetti } from "@/components/Confetti"
import { Nav } from "@/components/Nav"
import { Toast } from "@/components/Toast"
import { HomeScreen } from "@/screens/Home"
import { JournalScreen } from "@/screens/Journal"
import { OnboardingScreen } from "@/screens/Onboarding"
import { ProgressScreen } from "@/screens/Progress"
import { ShopScreen } from "@/screens/Shop"
import { useFeedback } from "@/state/useFeedback"
import { useGame } from "@/state/useGame"
import type { Screen } from "@/types"

export default function App() {
  const game = useGame()
  const feedback = useFeedback()
  const [screen, setScreen] = useState<Screen>(game.state.onboarded ? "home" : "onboarding")
  const [requestedDate, setRequestedDate] = useState<string | null>(null)

  // The screen is not a navigable history, so reset it whenever the save does.
  const wasOnboarded = useRef(game.state.onboarded)
  useEffect(() => {
    if (wasOnboarded.current === game.state.onboarded) return
    wasOnboarded.current = game.state.onboarded
    setScreen(game.state.onboarded ? "home" : "onboarding")
  }, [game.state.onboarded])

  // Xp arrives from three different actions, so watch the level instead. It can
  // only go up, except on reset, which drops it back to 1 without any fanfare.
  const { show, celebrate } = feedback
  const lastLevel = useRef(game.level)
  useEffect(() => {
    const previous = lastLevel.current
    lastLevel.current = game.level
    if (game.level <= previous) return
    show(`¡Nivel ${game.level}! ${game.state.companionName} ha crecido`)
    celebrate()
  }, [game.level, game.state.companionName, show, celebrate])

  const openDate = useCallback((date: string) => {
    setRequestedDate(date)
    setScreen("journal")
  }, [])

  const clearRequestedDate = useCallback(() => setRequestedDate(null), [])

  if (!game.state.onboarded) {
    return (
      <div className="app">
        <div className="app-body">
          <div className="app-main">
            <OnboardingScreen
              onDone={(userName, companionName) => {
                game.dispatch({ type: "onboard", today: game.today, userName, companionName })
                feedback.show(`${companionName.trim()} ha salido del huevo`)
                feedback.celebrate()
              }}
            />
          </div>
        </div>
        <Confetti active={feedback.celebrating} />
        <Toast message={feedback.toast} onDismiss={feedback.dismiss} />
      </div>
    )
  }

  return (
    <div className="app">
      <Nav
        active={screen}
        onChange={setScreen}
        coins={game.state.coins}
        companionName={game.state.companionName}
        level={game.level}
      />

      <div className="app-body">
        <div className="app-main">
          {screen === "home" && (
            <HomeScreen game={game} feedback={feedback} onNavigate={setScreen} />
          )}
          {screen === "journal" && (
            <JournalScreen
              game={game}
              feedback={feedback}
              requestedDate={requestedDate}
              onRequestedDateHandled={clearRequestedDate}
            />
          )}
          {screen === "progress" && (
            <ProgressScreen game={game} onOpenDate={openDate} onReset={game.reset} />
          )}
          {screen === "shop" && <ShopScreen game={game} feedback={feedback} />}
        </div>
      </div>

      <Confetti active={feedback.celebrating} />
      <Toast message={feedback.toast} onDismiss={feedback.dismiss} />
    </div>
  )
}
