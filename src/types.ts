export type Screen = "onboarding" | "home" | "journal" | "progress" | "shop"

/** A mood the user can actually pick. `null` means "not set today". */
export type MoodId = "joyful" | "calm" | "meh" | "sad" | "anxious"

export type Mood = MoodId | null

export interface JournalEntry {
  /** Local ISO date, `yyyy-mm-dd`. One entry per day. */
  date: string
  mood: MoodId
  text: string
  /** Id of the stamp pressed into the page, or null. */
  stamp: string | null
  /** The prompt shown when the entry was written. */
  prompt: string
}

export type MissionId =
  | "gratitude"
  | "walk"
  | "water"
  | "breathe"
  | "rest"
  | "connect"
  | "music"
  | "window"

export interface Mission {
  id: MissionId
  text: string
  coins: number
  icon: IconName
  /** Completes itself when the matching thing happens in the app. */
  auto?: "mood" | "entry"
}

export type ShopItemKind = "accessory" | "habitat" | "effect"

export interface ShopItem {
  id: string
  name: string
  desc: string
  cost: number
  kind: ShopItemKind
}

/** The default habitat is always available and never has to be bought. */
export const DEFAULT_HABITAT = "meadow"

export interface SaveState {
  version: number
  onboarded: boolean
  userName: string
  companionName: string
  coins: number
  xp: number
  entries: JournalEntry[]
  ownedItems: string[]
  equippedAccessory: string | null
  equippedHabitat: string
  /** ISO date the current `missions` set was rolled for. */
  missionDay: string | null
  missions: MissionId[]
  /** ISO date -> mission ids completed that day. */
  completedMissions: Record<string, MissionId[]>
}

/* ─── Icons ────────────────────────────────────────────────────────────────── */

export type IconName =
  // moods
  | "spark"
  | "wave"
  | "cloud"
  | "rain"
  | "leaf"
  // navigation
  | "home"
  | "book"
  | "sprout"
  | "bag"
  // missions
  | "walk"
  | "drop"
  | "breeze"
  | "moon"
  | "chat"
  | "music"
  | "sun"
  // journal stamps
  | "rainbow"
  | "bloom"
  | "butterfly"
  | "sparkle"
  | "hibiscus"
  | "shell"
  | "sunflower"
  // shop
  | "hat"
  | "crown"
  | "bow"
  | "starfield"
  | "petals"
  // stats + ui
  | "flame"
  | "trophy"
  | "coin"
  | "check"
  | "arrowLeft"
  | "close"
  | "sparkSmall"
