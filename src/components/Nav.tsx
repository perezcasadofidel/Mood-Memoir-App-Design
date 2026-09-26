import { CoinAmount, Icon } from "@/components/icons"
import type { IconName, Screen } from "@/types"

interface NavItem {
  id: Screen
  label: string
  icon: IconName
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "home", label: "Hogar", icon: "home" },
  { id: "journal", label: "Diario", icon: "book" },
  { id: "progress", label: "Progreso", icon: "sprout" },
  { id: "shop", label: "Tienda", icon: "bag" },
]

interface NavProps {
  active: Screen
  onChange: (screen: Screen) => void
  coins: number
  companionName: string
  level: number
}

/** Bottom bar on phones, left rail from 860px up. Same items, same handlers. */
export function Nav({ active, onChange, coins, companionName, level }: NavProps) {
  return (
    <>
      <nav className="nav-bar-rail" aria-label="Principal">
        <RailBrand companionName={companionName} level={level} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 18 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              aria-current={active === item.id ? "page" : undefined}
              onClick={() => onChange(item.id)}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "auto",
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            background: "var(--primary-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--text)" }}>Monedas</span>
          <CoinAmount value={coins} size={16} />
        </div>
      </nav>

      <nav className="nav-bar" aria-label="Principal">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="nav-item"
            style={{ flexDirection: "column", gap: 3, padding: "9px 0" }}
            aria-current={active === item.id ? "page" : undefined}
            onClick={() => onChange(item.id)}
          >
            <Icon name={item.icon} size={21} />
            <span style={{ fontSize: 11, fontWeight: 800 }}>{item.label}</span>
            {active === item.id && (
              <span
                aria-hidden="true"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "var(--primary-dark)",
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </>
  )
}

function RailBrand({ companionName, level }: { companionName: string; level: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #ffb5a7, #f4a261)",
          color: "#fff",
        }}
      >
        <Icon name="spark" size={20} />
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontSize: 16,
            color: "var(--text)",
            lineHeight: 1.1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {companionName}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-light)" }}>Nivel {level}</span>
      </span>
    </div>
  )
}
