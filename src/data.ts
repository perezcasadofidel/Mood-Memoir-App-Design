import type { IconName, Mission, MissionId, MoodId, ShopItem } from "@/types"

/* ─── Moods ────────────────────────────────────────────────────────────────── */

export interface MoodOption {
  id: MoodId
  label: string
  color: string
  icon: IconName
}

export const MOODS: readonly MoodOption[] = [
  { id: "joyful", label: "Radiante", color: "#ffd6a5", icon: "spark" },
  { id: "calm", label: "Tranquila", color: "#c0eaf1", icon: "wave" },
  { id: "meh", label: "Así así", color: "#e4e4e6", icon: "cloud" },
  { id: "sad", label: "Triste", color: "#bfd7ea", icon: "rain" },
  { id: "anxious", label: "Ansiosa", color: "#f4c2c2", icon: "leaf" },
]

export const MOOD_BY_ID: Record<MoodId, MoodOption> = MOODS.reduce(
  (acc, mood) => {
    acc[mood.id] = mood
    return acc
  },
  {} as Record<MoodId, MoodOption>,
)

export const moodColor = (mood: MoodId | null): string =>
  mood ? MOOD_BY_ID[mood].color : "rgba(61, 64, 91, 0.06)"

/* ─── Missions ─────────────────────────────────────────────────────────────── */

export const MISSION_POOL: readonly Mission[] = [
  {
    id: "gratitude",
    text: "Escribe 3 cosas por las que estés agradecida",
    coins: 15,
    icon: "spark",
    auto: "entry",
  },
  { id: "walk", text: "Sal a caminar 5 minutos al aire libre", coins: 20, icon: "walk" },
  { id: "water", text: "Bebe 2 vasos de agua ahora mismo", coins: 10, icon: "drop" },
  { id: "breathe", text: "Respira profundo 5 veces", coins: 10, icon: "breeze" },
  { id: "rest", text: "Descansa la pantalla 20 minutos", coins: 15, icon: "moon" },
  { id: "connect", text: "Manda un mensaje a alguien que quieres", coins: 20, icon: "chat" },
  { id: "music", text: "Escucha una canción que te gusta", coins: 10, icon: "music" },
  { id: "window", text: "Abre una ventana y mira el cielo", coins: 15, icon: "sun" },
]

export const MISSIONS_PER_DAY = 4

export const MISSION_BY_ID: Record<MissionId, Mission> = MISSION_POOL.reduce(
  (acc, mission) => {
    acc[mission.id] = mission
    return acc
  },
  {} as Record<MissionId, Mission>,
)

/* ─── Shop ─────────────────────────────────────────────────────────────────── */

/** The only effect for now, and the one that turns the petal overlay on. */
export const PETALS_ID = "petals"

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: "hat", name: "Sombrero Mago", desc: "Para los días de buenas ideas", cost: 30, kind: "accessory" },
  { id: "bow", name: "Lazo Encantado", desc: "Adorablemente práctico", cost: 20, kind: "accessory" },
  { id: "crown", name: "Corona Sencilla", desc: "Majestuosa y luminosa", cost: 50, kind: "accessory" },
  { id: "bg_star", name: "Hábitat Estelar", desc: "Un cielo lleno de estrellas", cost: 40, kind: "habitat" },
  { id: "bg_moon", name: "Jardín Lunar", desc: "Brilla bajo la luna", cost: 60, kind: "habitat" },
  { id: PETALS_ID, name: "Lluvia de Pétalos", desc: "Magia floral permanente", cost: 35, kind: "effect" },
]

export const SHOP_BY_ID: Record<string, ShopItem> = SHOP_ITEMS.reduce(
  (acc, item) => {
    acc[item.id] = item
    return acc
  },
  {} as Record<string, ShopItem>,
)

/* ─── Journal prompts ──────────────────────────────────────────────────────── */

export const PROMPTS: readonly string[] = [
  "¿Qué pequeño momento hermoso tuviste hoy?",
  "Nombra tres cosas por las que estés agradecida.",
  "¿Qué necesitas soltar hoy?",
  "¿Qué te hizo sonreír recientemente?",
  "Si hoy fuera una página de un libro, ¿de qué color sería?",
  "¿Qué es lo que más te costó de esta semana?",
  "Describe un lugar donde te sientes en paz.",
  "¿Qué harías hoy solo por gusto?",
  "¿Qué le dirías a tu yo de hace un año?",
  "¿Qué te enseñó el cuerpo hoy, aunque fuera poco?",
]

/* ─── Stamps ───────────────────────────────────────────────────────────────── */

export interface Stamp {
  id: string
  name: string
  icon: IconName
  color: string
}

export const STAMPS: readonly Stamp[] = [
  { id: "sun", name: "Sol", icon: "sun", color: "#f4a261" },
  { id: "rainbow", name: "Arcoíris", icon: "rainbow", color: "#a8dadc" },
  { id: "bloom", name: "Flor", icon: "bloom", color: "#ffb5a7" },
  { id: "butterfly", name: "Mariposa", icon: "butterfly", color: "#b39ddb" },
  { id: "moon", name: "Luna", icon: "moon", color: "#bfd7ea" },
  { id: "sparkle", name: "Chispa", icon: "sparkle", color: "#f4a261" },
  { id: "wave", name: "Ola", icon: "wave", color: "#7cc2c6" },
  { id: "leaf", name: "Hoja", icon: "leaf", color: "#8fbf6e" },
  { id: "hibiscus", name: "Hibisco", icon: "hibiscus", color: "#e77a8c" },
  { id: "star", name: "Estrella", icon: "spark", color: "#e8b04b" },
  { id: "shell", name: "Concha", icon: "shell", color: "#d8b48b" },
  { id: "sunflower", name: "Girasol", icon: "sunflower", color: "#eaa62a" },
]
