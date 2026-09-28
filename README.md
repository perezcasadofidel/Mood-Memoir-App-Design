# Mood Memoir

Diario de ánimo en español con un compañero virtual que crece contigo. Registra cómo te
sientes, escribe tu página del día, cumple misiones, gana monedas y decora a **Lumis** en
su hábitat.

SPA en React 19 + Vite 8 + TypeScript. Sin router, sin Tailwind, sin red: todo el estado
vive en un reducer y se guarda en `localStorage`.

## Qué incluye

- **Onboarding** — nombre tuyo y nombre del compañero, en una sola pasada.
- **Home** — saludo según la hora, check-in de ánimo (5 ánimos), 4 misiones del día, nivel
  y XP.
- **Diario** — una página por día con prompt estable, sello entre 12 opciones y lista de
  páginas anteriores.
- **Progreso** — calendario del mes, racha real, totales y estado del compañero.
- **Tienda** — accesorios, hábitats (`meadow`, `bg_star`, `bg_moon`) y efectos (`petals`)
  comprados con monedas, con botón para quitar el accesorio equipado.
- **Gamificación** — +5 XP por el check-in, +10 por escribir la página, monedas por misión;
  `nivel = floor(xp/100) + 1`, con toast y confetti al subir.
- **Persistencia** — save versionado y saneado en `localStorage` (`mood-memoir:save`), con
  ids y fechas validados contra `data.ts`; un save corrupto degrada en vez de romper la app.

## Stack

| | |
| --- | --- |
| Runtime | React 19 · TypeScript 5.7 |
| Build | Vite 8 · `@vitejs/plugin-react` |
| Formato | oxfmt (no hay linter ni test runner) |
| Gestor de paquetes | pnpm (`node` 22 + `pnpm` fijados en `.mise.toml`) |

## Puesta en marcha

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

### Scripts

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Dev server en `0.0.0.0:5173` |
| `pnpm build` | Build de producción a `dist/` |
| `pnpm preview` | Sirve `dist/` en el mismo puerto |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Formatea con oxfmt |

No hay lint, ni tests, ni CI. La única verificación disponible es `pnpm typecheck`.

> Nota: el formateo no está limpio. `oxfmt --check` marca los archivos escritos a mano y
> pasar oxfmt sobre un archivo grande produce un diff enorme solo por re-envolver; no lo
> corras a mitad de una tarea.

## Estructura

```
src/
  main.tsx              StrictMode, monta <App/>
  App.tsx               shell: pantalla actual + nav + confetti + toast
  types.ts              Screen, MoodId, JournalEntry, Mission, ShopItem, SaveState, IconName
  data.ts               MOODS, MISSION_POOL, SHOP_ITEMS, PROMPTS, STAMPS
  index.css             reset, tokens y todas las reglas responsive
  lib/date.ts           fechas locales yyyy-mm-dd, calendario, racha, hash
  lib/random.ts         LCG sembrado, decoración estable entre renders
  lib/storage.ts        load/save/sanitize de SaveState
  state/useGame.ts      reducer único + derivados de la partida
  state/useFeedback.ts  toast y confetti con timers limpiados
  components/           icons, Companion, Habitat, Confetti, Nav, Toast, ScreenHeader
  screens/              Onboarding, Home, Journal, Progress, Shop
```

## Decisiones de arquitectura

- **Sin router.** `type Screen = "onboarding" | "home" | "journal" | "progress" | "shop"`
  y un `useState<Screen>` en `App()` eligen la pantalla; `Nav` llama a `setScreen`.
- **Un solo reducer** sobre `SaveState`; los derivados (nivel, XP dentro del nivel, racha,
  misiones del día, totales) salen de un `useMemo`, nunca de estado duplicado. Nada de
  setters dentro de updaters: `StrictMode` los invoca dos veces en dev y los payouts se
  duplicarían.
- **Fechas siempre locales en `yyyy-mm-dd`**, nunca UTC; toda la aritmética pasa por
  `lib/date.ts`.
- **Misiones deterministas**: se ordenan con `hashString(fecha:id)`, así que recargar no
  las vuelve a sortear, y `ensureToday` las renueva al cambiar de día.
- **Tailwind no está.** Layout y color con `style={{}}` en línea y clases propias de
  `index.css`; las reglas por breakpoint viven en el CSS con tokens en `:root`.
- **Todo el estado se persiste** en un efecto de `useGame`; el modo privado o la cuota
  llena no rompen nada, se sigue jugando en memoria.
- **Ilustración SVG inline** (`components/Companion.tsx`, `components/icons.tsx`, el huevo
  del onboarding): 30 glifos propios sobre `currentColor`, cero emojis en el código.

## Layout y responsive

- Cadena de layout: `.app` (flex column, `min-height: 100dvh`) > `.app-body` >
  `.app-main` > `.screen` + `.screen-pad` + `.screen-body`. Cualquier columna única pasa
  por `.screen-body` o `.stack`.
- Tracks de grid siempre `minmax(0, …)`, nunca `1fr`, y `min-width: 0` en los items con
  contenido flexible — un `1fr` deja que una palabra larga ensanche la columna y la página
  scrollee en horizontal.
- El documento es el único contenedor de scroll: nada dentro de `.app` lleva
  `overflow: hidden/auto`.
- Breakpoints: <860px una columna y bottom nav; ≥860px rail lateral y dos columnas en
  Home/Diario/Progreso. Los tiles de ánimo van 3 en <520px y 5 desde ahí.

## Accesibilidad

`:focus-visible` con outline, `aria-pressed` en los tiles conmutables, `aria-current="page"`
en la nav, `role="progressbar"` con sus `aria-value*` en la barra de XP, `aria-live="polite"`
en toasts y avisos, `.sr-only` para texto de lector, y `prefers-reduced-motion` que
neutraliza las animaciones.

## Privacidad

Sin backend y sin peticiones de red: la partida solo vive en tu navegador, bajo la clave
`localStorage` `mood-memoir:save`. Borrar los datos del sitio borra la partida.

