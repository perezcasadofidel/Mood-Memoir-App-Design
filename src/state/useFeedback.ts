import { useCallback, useEffect, useRef, useState } from "react"
import type { RefObject } from "react"

const TOAST_MS = 2800
const CELEBRATION_MS = 2000

export interface Feedback {
  toast: string | null
  celebrating: boolean
  show: (message: string) => void
  celebrate: () => void
  dismiss: () => void
}

/** Toast text and the confetti burst, both with timers that clean themselves up. */
export function useFeedback(): Feedback {
  const [toast, setToast] = useState<string | null>(null)
  const [celebrating, setCelebrating] = useState(false)
  const toastTimer = useRef<number | null>(null)
  const celebrationTimer = useRef<number | null>(null)

  const clear = useCallback((timer: RefObject<number | null>) => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }, [])

  useEffect(() => {
    const timers = [toastTimer, celebrationTimer]
    return () => {
      for (const timer of timers) {
        if (timer.current !== null) window.clearTimeout(timer.current)
      }
    }
  }, [])

  const show = useCallback(
    (message: string) => {
      clear(toastTimer)
      setToast(message)
      toastTimer.current = window.setTimeout(() => {
        setToast(null)
        toastTimer.current = null
      }, TOAST_MS)
    },
    [clear],
  )

  const celebrate = useCallback(() => {
    clear(celebrationTimer)
    setCelebrating(true)
    celebrationTimer.current = window.setTimeout(() => {
      setCelebrating(false)
      celebrationTimer.current = null
    }, CELEBRATION_MS)
  }, [clear])

  const dismiss = useCallback(() => {
    clear(toastTimer)
    setToast(null)
  }, [clear])

  return { toast, celebrating, show, celebrate, dismiss }
}
