import { Icon } from "@/components/icons"

export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
        transform: "translateX(-50%)",
        zIndex: 70,
        pointerEvents: "none",
        width: "min(92vw, 420px)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {message !== null && (
        <div
          className="pop-in"
          style={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "var(--text)",
            color: "#fff8f0",
            borderRadius: 999,
            padding: "11px 14px 11px 18px",
            fontWeight: 700,
            fontSize: 14,
            boxShadow: "var(--shadow-lift)",
            maxWidth: "100%",
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Cerrar aviso"
            style={{
              border: "none",
              background: "rgba(255,255,255,0.16)",
              color: "inherit",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="close" size={13} strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  )
}
