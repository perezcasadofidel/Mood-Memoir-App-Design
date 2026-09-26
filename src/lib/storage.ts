import { MISSION_BY_ID, MOOD_BY_ID, SHOP_BY_ID, STAMPS } from "@/data"
import { fromISODate, toISODate } from "@/lib/date"
import { DEFAULT_HABITAT, type JournalEntry, type MissionId, type MoodId, type SaveState } from "@/types"

const STORAGE_KEY = "mood-memoir:save"
const SCHEMA_VERSION = 1

export function createInitialState(): SaveState {
  return {
    version: SCHEMA_VERSION,
    onboarded: false,
    userName: "",
    companionName: "",
    coins: 0,
    xp: 0,
    entries: [],
    ownedItems: [],
    equippedAccessory: null,
    equippedHabitat: DEFAULT_HABITAT,
    missionDay: null,
    missions: [],
    completedMissions: {},
  }
}

const asString = (value: unknown, fallback: string): string =>
  typeof value === "string" ? value : fallback

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []

/* ─── Ids, checked against data.ts ───────────────────────────────────────────
   A save is just a blob in localStorage, so every id coming out of it is
   untrusted. Anything unknown is dropped instead of being trusted: the screens
   index MOOD_BY_ID, MISSION_BY_ID and SHOP_BY_ID with it and would crash. */

/** `in` would accept "toString" and friends; only own keys are real ids. */
const hasKey = (map: object, key: string): boolean =>
  Object.prototype.hasOwnProperty.call(map, key)

const isMoodId = (value: unknown): value is MoodId =>
  typeof value === "string" && hasKey(MOOD_BY_ID, value)

const isMissionId = (value: unknown): value is MissionId =>
  typeof value === "string" && hasKey(MISSION_BY_ID, value)

const isShopId = (value: unknown): value is string =>
  typeof value === "string" && hasKey(SHOP_BY_ID, value)

const isStampId = (value: unknown): value is string =>
  typeof value === "string" && STAMPS.some((stamp) => stamp.id === value)

/** A yyyy-mm-dd that is also a real day: round-tripping it must be lossless. */
const isISODate = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  toISODate(fromISODate(value)) === value

function sanitizeEntry(raw: unknown): JournalEntry | null {
  if (typeof raw !== "object" || raw === null) return null
  const entry = raw as Partial<JournalEntry>
  if (!isISODate(entry.date)) return null
  return {
    date: entry.date,
    // Keep the words even if the mood is unreadable; "meh" is the neutral one.
    mood: isMoodId(entry.mood) ? entry.mood : "meh",
    text: asString(entry.text, ""),
    stamp: isStampId(entry.stamp) ? entry.stamp : null,
    prompt: asString(entry.prompt, ""),
  }
}

/** Sorted by date and one entry per day, the same shape the reducer writes. */
function sanitizeEntries(value: unknown): JournalEntry[] {
  if (!Array.isArray(value)) return []
  const byDate = new Map<string, JournalEntry>()
  for (const raw of value) {
    const entry = sanitizeEntry(raw)
    if (entry !== null) byDate.set(entry.date, entry)
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

/** Anything unreadable falls back to a fresh save rather than crashing the app. */
function sanitize(raw: unknown): SaveState {
  const base = createInitialState()
  if (typeof raw !== "object" || raw === null) return base

  const input = raw as Partial<SaveState>
  const ownedItems = asStringArray(input.ownedItems).filter(isShopId)

  const completed: Record<string, MissionId[]> = {}
  if (typeof input.completedMissions === "object" && input.completedMissions !== null) {
    for (const [date, ids] of Object.entries(input.completedMissions)) {
      if (isISODate(date) && Array.isArray(ids)) {
        completed[date] = [...new Set(ids.filter(isMissionId))]
      }
    }
  }

  // Equipped things have to be owned, or the save is asking for a free item.
  const accessory = isShopId(input.equippedAccessory) ? input.equippedAccessory : null
  const equippedAccessory =
    accessory !== null && ownedItems.includes(accessory) &&
    SHOP_BY_ID[accessory].kind === "accessory"
      ? accessory
      : null

  const habitat = input.equippedHabitat
  const equippedHabitat =
    habitat === DEFAULT_HABITAT || (isShopId(habitat) && ownedItems.includes(habitat))
      ? habitat
      : DEFAULT_HABITAT

  return {
    version: SCHEMA_VERSION,
    onboarded: input.onboarded === true,
    userName: asString(input.userName, ""),
    companionName: asString(input.companionName, ""),
    coins: Math.max(0, asNumber(input.coins, 0)),
    xp: Math.max(0, asNumber(input.xp, 0)),
    entries: sanitizeEntries(input.entries),
    ownedItems,
    equippedAccessory,
    equippedHabitat,
    missionDay: isISODate(input.missionDay) ? input.missionDay : null,
    missions: asStringArray(input.missions).filter(isMissionId),
    completedMissions: completed,
  }
}

export function loadSave(): SaveState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    return sanitize(JSON.parse(raw))
  } catch {
    return null
  }
}

export function persistSave(state: SaveState): SaveState {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or a full quota: the app keeps working in memory.
  }
  return state
}

export function clearSave(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
