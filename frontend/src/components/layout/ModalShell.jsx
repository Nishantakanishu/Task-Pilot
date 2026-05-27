import { X } from "lucide-react";

const TONES = {
  brand: {
    accent: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
    tint: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.98) 100%)",
  },
  danger: {
    accent: "linear-gradient(135deg, #DC2626 0%, #F97316 100%)",
    tint: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,247,246,0.98) 100%)",
  },
};

const ModalShell = ({
  children,
  title,
  description,
  eyebrow,
  icon,
  onClose,
  maxWidth = "560px",
  tone = "brand",
  contentPadding = "28px",
}) => {
  const colors = TONES[tone] || TONES.brand;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(12,27,58,0.42)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="modal-content"
        style={{
          width: "100%",
          maxWidth,
          maxHeight: "calc(100dvh - 32px)",
          overflow: "hidden",
          borderRadius: "30px",
          border: "1px solid rgba(216,227,255,0.95)",
          background: colors.tint,
          boxShadow: "0 28px 80px rgba(12,27,58,0.22)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            height: 6,
            background: colors.accent,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 16,
            padding: contentPadding,
            paddingBottom: 22,
          }}
        >
          {icon ? (
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                background: colors.accent,
                boxShadow:
                  tone === "danger"
                    ? "0 14px 30px rgba(220,38,38,0.18)"
                    : "0 14px 30px rgba(30,95,255,0.18)",
              }}
            >
              {icon}
            </div>
          ) : null}

          <div style={{ minWidth: 0, flex: 1 }}>
            {eyebrow ? (
              <p
                style={{
                  color: "#1E5FFF",
                  fontSize: 11.5,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              style={{
                color: "#0C1B3A",
                fontSize: "clamp(1.35rem, 2vw, 1.7rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 1.06,
                marginBottom: description ? 8 : 0,
              }}
            >
              {title}
            </h2>
            {description ? (
              <p
                style={{
                  color: "#5B6B8A",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              flexShrink: 0,
              border: "1px solid rgba(216,227,255,0.95)",
              background: "#F8FBFF",
              color: "#5B6B8A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tone === "danger" ? "#FEF2F2" : "#EBF0FF";
              e.currentTarget.style.color = tone === "danger" ? "#DC2626" : "#1E5FFF";
              e.currentTarget.style.borderColor = tone === "danger" ? "rgba(220,38,38,0.18)" : "rgba(30,95,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F8FBFF";
              e.currentTarget.style.color = "#5B6B8A";
              e.currentTarget.style.borderColor = "rgba(216,227,255,0.95)";
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: `0 ${contentPadding} ${contentPadding}`,
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalShell;
