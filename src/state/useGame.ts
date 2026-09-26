import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import type { Dispatch } from "react"
import { MISSION_BY_ID, MISSION_POOL, MISSIONS_PER_DAY, PETALS_ID, SHOP_BY_ID } from "@/data"
import { addDays, computeStreak, hashString, todayISO } from "@/lib/date"
import { clearSave, createInitialState, loadSave, persistSave } from "@/lib/storage"
import type { JournalEntry, Mission, MissionId, MoodId, SaveState } from "@/types"

/** XP awarded per level, and for each tracked action. */
export const XP_PER_LEVEL = 100
export const XP_FOR_MOOD = 5
export const XP_FOR_ENTRY = 10

export type Action =
  | { type: "onboard"; today: string; userName: string; companionName: string }
  | { type: "set-mood"; today: string; mood: MoodId }
  | {
      type: "save-entry"
      today: string
      date: string
      mood: MoodId
      text: string
      stamp: string | null
      prompt: string
    }
  | { type: "complete-mission"; today: string; id: MissionId }
  | { type: "buy"; today: string; id: string }
  | { type: "equip-accessory"; today: string; id: string }
  | { type: "equip-habitat"; today: string; id: string }
  | { type: "reset" }

/** Deterministic per calendar day, so a reload never rerolls the missions. */
function pickMissions(iso: string, count: number = MISSIONS_PER_DAY): MissionId[] {
  return MISSION_POOL.map((mission) => ({
    id: mission.id,
    key: hashString(`${iso}:${mission.id}`),
  }))
    .sort((a, b) => a.key - b.key)
    .slice(0, count)
    .map((mission) => mission.id)
}

const PRUNE_AFTER_DAYS = 60

function pruneOldCompletions(state: SaveState, today: string): SaveState {
  const cutoff = addDays(today, -PRUNE_AFTER_DAYS)
  const kept: Record<string, MissionId[]> = {}
  for (const [date, ids] of Object.entries(state.completedMissions)) {
    if (date >= cutoff) kept[date] = ids
  }
  return { ...state, completedMissions: kept }
}

/** Rolls the daily mission set when the calendar day changes. */
function ensureToday(state: SaveState, today: string): SaveState {
  if (state.missionDay === today) return state
  const pruned = pruneOldCompletions(state, today)
  return { ...pruned, missionDay: today, missions: pickMissions(today) }
}

function completeMission(state: SaveState, id: MissionId, today: string): SaveState {
  const doneToday = state.completedMissions[today] ?? []
  if (doneToday.includes(id)) return state

  const reward = MISSION_BY_ID[id].coins
  return {
    ...state,
    coins: state.coins + reward,
    xp: state.xp + reward,
    completedMissions: { ...state.completedMissions, [today]: [...doneToday, id] },
  }
}

/** Completes the missions that the app can verify on its own. */
function autoComplete(state: SaveState, kind: NonNullable<Mission["auto"]>, today: string) {
  let next = state
  for (const id of state.missions) {
    const mission = MISSION_BY_ID[id]
    if (mission.auto !== kind) continue
    next = completeMission(next, id, today)
  }
  return next
}

function upsertEntry(state: SaveState, entry: JournalEntry): SaveState {
  const existing = state.entries.find((item) => item.date === entry.date)
  const entries = existing
    ? state.entries.map((item) => (item.date === entry.date ? entry : item))
    : [...state.entries, entry]

  entries.sort((a, b) => a.date.localeCompare(b.date))
  return { ...state, entries }
}

/** `true` when this is the first time today gets a mood on the page. */
function isFirstMoodOfDay(state: SaveState, today: string): boolean {
  return !state.entries.some((entry) => entry.date === today)
}

/** `true` when the day had no writing on it yet. */
function isFirstWordsOfDay(state: SaveState, date: string): boolean {
  const existing = state.entries.find((entry) => entry.date === date)
  return existing === undefined || existing.text.trim().length === 0
}

export function gameReducer(state: SaveState, action: Action): SaveState {
  switch (action.type) {
    case "onboard":
      return {
        ...ensureToday(state, action.today),
        onboarded: true,
        userName: action.userName.trim(),
        companionName: action.companionName.trim(),
      }

    case "set-mood": {
      const rolled = ensureToday(state, action.today)
      const existing = rolled.entries.find((entry) => entry.date === action.today)
      const withMood = upsertEntry(rolled, {
        date: action.today,
        mood: action.mood,
        text: existing?.text ?? "",
        stamp: existing?.stamp ?? null,
        prompt: existing?.prompt ?? "",
      })
      const withXp = isFirstMoodOfDay(rolled, action.today)
        ? { ...withMood, xp: withMood.xp + XP_FOR_MOOD }
        : withMood
      return autoComplete(withXp, "mood", action.today)
    }

    case "save-entry": {
      const rolled = ensureToday(state, action.today)
      const withEntry = upsertEntry(rolled, {
        date: action.date,
        mood: action.mood,
        text: action.text,
        stamp: action.stamp,
        prompt: action.prompt,
      })
      // Rewriting a page that already had words on it is not new progress.
      const withXp = isFirstWordsOfDay(rolled, action.date)
        ? { ...withEntry, xp: withEntry.xp + XP_FOR_ENTRY }
        : withEntry
      return autoComplete(withXp, "entry", action.today)
    }

    case "complete-mission": {
      const rolled = ensureToday(state, action.today)
      return completeMission(rolled, action.id, action.today)
    }

    case "buy": {
      const rolled = ensureToday(state, action.today)
      const item = SHOP_BY_ID[action.id]
      if (!item) return rolled
      if (rolled.ownedItems.includes(action.id)) return rolled
      if (rolled.coins < item.cost) return rolled

      const bought: SaveState = {
        ...rolled,
        coins: rolled.coins - item.cost,
        ownedItems: [...rolled.ownedItems, action.id],
      }
      return item.kind === "habitat" ? { ...bought, equippedHabitat: action.id } : bought
    }

    case "equip-accessory": {
      const rolled = ensureToday(state, action.today)
      if (!rolled.ownedItems.includes(action.id)) return rolled
      const same = rolled.equippedAccessory === action.id
      return { ...rolled, equippedAccessory: same ? null : action.id }
    }

    case "equip-habitat": {
      const rolled = ensureToday(state, action.today)
      if (!rolled.ownedItems.includes(action.id)) return rolled
      if (rolled.equippedHabitat === action.id) return rolled
      return { ...rolled, equippedHabitat: action.id }
    }

    case "reset":
      clearSave()
      return createInitialState()
  }
}

export interface Game {
  state: SaveState
  dispatch: Dispatch<Action>
  today: string
  level: number
  xpIntoLevel: number
  progressPct: number
  streak: number
  todayEntry: JournalEntry | null
  latestMood: MoodId | null
  todayMissions: Mission[]
  todayCompleted: MissionId[]
  missionsDoneTotal: number
  entryCount: number
  hasPetals: boolean
  reset: () => void
}

export function useGame(): Game {
  const [state, dispatch] = useReducer(gameReducer, null, () => loadSave() ?? createInitialState())
  const [today, setToday] = useState(todayISO)

  // Re-render when the calendar day rolls over, so missions reset themselves.
  useEffect(() => {
    const id = window.setInterval(() => {
      const next = todayISO()
      setToday((prev) => (prev === next ? prev : next))
    }, 30_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    persistSave(state)
  }, [state])

  const reset = useCallback(() => dispatch({ type: "reset" }), [])

  return useMemo<Game>(() => {
    const rolled = ensureToday(state, today)
    const doneToday = rolled.completedMissions[today] ?? []
    const latest = rolled.entries.length > 0 ? rolled.entries[rolled.entries.length - 1] : null

    return {
      state: rolled,
      dispatch,
      today,
      level: Math.floor(rolled.xp / XP_PER_LEVEL) + 1,
      xpIntoLevel: rolled.xp % XP_PER_LEVEL,
      progressPct: (rolled.xp % XP_PER_LEVEL) / XP_PER_LEVEL,
      streak: computeStreak(
        rolled.entries.map((entry) => entry.date),
        today,
      ),
      todayEntry: rolled.entries.find((entry) => entry.date === today) ?? null,
      latestMood: latest?.mood ?? null,
      todayMissions: rolled.missions.map((id) => MISSION_BY_ID[id]),
      todayCompleted: doneToday,
      missionsDoneTotal: Object.values(rolled.completedMissions).reduce(
        (total, ids) => total + ids.length,
        0,
      ),
      entryCount: rolled.entries.length,
      hasPetals: rolled.ownedItems.includes(PETALS_ID),
      reset,
    }
  }, [state, dispatch, today, reset])
}
