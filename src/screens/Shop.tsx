import { ScreenHeader } from "@/components/ScreenHeader"
import { Companion } from "@/components/Companion"
import { CoinAmount, Icon } from "@/components/icons"
import { habitatLabel } from "@/components/Habitat"
import { SHOP_ITEMS } from "@/data"
import type { Feedback } from "@/state/useFeedback"
import type { Game } from "@/state/useGame"
import type { IconName, ShopItem, ShopItemKind } from "@/types"

interface ShopProps {
  game: Game
  feedback: Feedback
}

const SECTIONS: { kind: ShopItemKind; title: string; blurb: string }[] = [
  {
    kind: "accessory",
    title: "Accesorios",
    blurb: "Se los pone a tu compañero. Puedes quitárselos cuando quieras.",
  },
  {
    kind: "habitat",
    title: "Hábitats",
    blurb: "Cambian el paisaje donde vive. Uno va incluido de serie.",
  },
  {
    kind: "effect",
    title: "Efectos",
    blurb: "Se quedan activos para siempre una vez comprados.",
  },
]

const ITEM_ICON: Record<string, IconName> = {
  hat: "hat",
  bow: "bow",
  crown: "crown",
  bg_star: "starfield",
  bg_moon: "moon",
  petals: "petals",
}

export function ShopScreen({ game, feedback }: ShopProps) {
  const { state, today } = game

  return (
    <div className="screen">
      <ScreenHeader
        title="Tienda"
        subtitle="Objetos para tu compañero"
        tint="linear-gradient(135deg, #ffe8d6, #ffdcc8)"
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
            <Icon name="bag" size={21} />
          </span>
        }
        aside={
          <div
            className="card-quiet"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px" }}
          >
            <CoinAmount value={state.coins} size={18} />
            <span style={{ fontSize: 12, color: "var(--text-light)" }}>monedas</span>
          </div>
        }
      />

      <div className="screen-pad screen-body">
        <section className="card" style={{ padding: "var(--pad)" }}>
          <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
            <div className="float-anim" style={{ flexShrink: 0 }}>
              <Companion
                mood={game.latestMood}
                level={game.level}
                size={104}
                accessory={state.equippedAccessory}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2
                style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)" }}
              >
                Así se ve {state.companionName}
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-light)", margin: "4px 0 12px" }}>
                {habitatLabel(state.equippedHabitat)}
                {state.equippedAccessory === null
                  ? " · sin accesorios"
                  : ` · con ${SHOP_ITEMS.find((item) => item.id === state.equippedAccessory)?.name.toLowerCase()}`}
                {game.hasPetals ? " · con lluvia de pétalos" : ""}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-light)" }}>
                Las monedas se ganan registro de ánimos, escribiendo y completando misiones.
              </p>
            </div>
          </div>
        </section>

        {SECTIONS.map((section) => {
          const items = SHOP_ITEMS.filter((item) => item.kind === section.kind)
          return (
            <section key={section.kind} aria-labelledby={`section-${section.kind}`}>
              <h2
                id={`section-${section.kind}`}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                {section.title}
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-light)", marginBottom: 14 }}>
                {section.blurb}
              </p>
              <div className="grid-shop">
                {items.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    game={game}
                    onBuy={() => {
                      game.dispatch({ type: "buy", today, id: item.id })
                      feedback.celebrate()
                      feedback.show(`${item.name} comprado. Se equipa solo`)
                    }}
                    onEquip={() => {
                      if (item.kind === "accessory") {
                        const wasEquipped = state.equippedAccessory === item.id
                        game.dispatch({ type: "equip-accessory", today, id: item.id })
                        feedback.show(wasEquipped ? `${item.name} guardado` : `${item.name} puesto`)
                      } else {
                        game.dispatch({ type: "equip-habitat", today, id: item.id })
                        feedback.show(`Hábitat cambiado a ${habitatLabel(item.id)}`)
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

interface ItemCardProps {
  item: ShopItem
  game: Game
  onBuy: () => void
  onEquip: () => void
}

function ItemCard({ item, game, onBuy, onEquip }: ItemCardProps) {
  const { state } = game
  const owned = state.ownedItems.includes(item.id)
  const equipped =
    item.kind === "accessory"
      ? state.equippedAccessory === item.id
      : item.kind === "habitat"
        ? state.equippedHabitat === item.id
        : owned
  const missing = Math.max(item.cost - state.coins, 0)

  return (
    <article
      className="card"
      style={{
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        border: equipped ? "2px solid var(--primary-dark)" : "1px solid var(--card-border)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: "grid",
          placeItems: "center",
          height: 62,
          borderRadius: 16,
          background: equipped ? "var(--primary-soft)" : "rgba(61,64,91,0.04)",
          color: equipped ? "var(--primary-ink)" : "var(--text-light)",
          marginBottom: 6,
        }}
      >
        <Icon name={ITEM_ICON[item.id] ?? "spark"} size={30} />
      </span>

      <h3 style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{item.name}</h3>
      <p style={{ fontSize: 12, color: "var(--text-light)", lineHeight: 1.45, flex: 1 }}>
        {item.desc}
      </p>

      <div style={{ marginTop: 8 }}>
        {item.kind === "effect" && owned ? (
          <StatusChip label="Activo para siempre" />
        ) : item.kind === "habitat" && equipped ? (
          <StatusChip label="En uso ahora mismo" />
        ) : item.kind === "accessory" && equipped ? (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", fontSize: 13, padding: 10 }}
            onClick={onEquip}
          >
            Quitar
          </button>
        ) : owned ? (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", fontSize: 13, padding: 10 }}
            onClick={onEquip}
          >
            {item.kind === "habitat" ? "Usar este" : "Equipar"}
          </button>
        ) : missing > 0 ? (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", fontSize: 13, padding: 10 }}
            onClick={onBuy}
            disabled
          >
            Faltan {missing}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: "100%", fontSize: 13, padding: 10 }}
            onClick={onBuy}
          >
            <CoinAmount value={item.cost} size={14} tone="paper" />
          </button>
        )}
      </div>

    </article>
  )
}

function StatusChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "block",
        textAlign: "center",
        padding: "9px 10px",
        borderRadius: 30,
        fontSize: 12,
        fontWeight: 800,
        background: "rgba(143,191,110,0.2)",
        color: "#4f7a33",
      }}
    >
      {label}
    </span>
  )
}
