/** Local-date helpers. Everything in the save file is keyed by local `yyyy-mm-dd`. */

export function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const date = fromISODate(iso)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function formatLongDate(iso: string): string {
  return fromISODate(iso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function formatShortDate(iso: string): string {
  return fromISODate(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" })
}

export interface CalendarDay {
  iso: string
  dayOfMonth: number
  isToday: boolean
}

/** Monday-first weekday index (0 = lunes). */
function mondayIndex(iso: string): number {
  return (fromISODate(iso).getDay() + 6) % 7
}

export interface Calendar {
  leading: number
  days: CalendarDay[]
  trailing: number
}

/**
 * A `weeks * 7` day grid ending on `endISO`, padded with empty cells so the
 * first day lands under its real weekday column.
 */
export function buildCalendar(weeks: number, endISO: string): Calendar {
  const total = weeks * 7
  const start = addDays(endISO, -(total - 1))
  const leading = mondayIndex(start)
  const days: CalendarDay[] = []

  for (let i = 0; i < total; i++) {
    const iso = addDays(start, i)
    days.push({ iso, dayOfMonth: fromISODate(iso).getDate(), isToday: iso === endISO })
  }

  const trailing = (7 - ((leading + total) % 7)) % 7
  return { leading, days, trailing }
}

/**
 * Consecutive days with an entry, counting back from today. A streak survives
 * until the end of the following day, so an entry yesterday with none today
 * still counts.
 */
export function computeStreak(dates: string[], today: string): number {
  if (dates.length === 0) return 0

  const set = new Set(dates)
  const yesterday = addDays(today, -1)
  if (!set.has(today) && !set.has(yesterday)) return 0

  let cursor = set.has(today) ? today : yesterday
  let streak = 0
  while (set.has(cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Stable non-cryptographic hash, used to pick a mission set per calendar day. */
export function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
