import { Link } from "react-router-dom";
import { AlertCircle, Clock, ArrowRight } from "lucide-react";

const OverdueAlert = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        className="animate-fade-in-up delay-200"
        style={{
          background: "#fff",
          border: "1.5px solid #D8E3FF",
          borderRadius: "20px",
          padding: "48px 24px",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
        }}
      >
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#ECFDF5", border: "1px solid #A7F3D0",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <AlertCircle style={{ width: 28, height: 28, color: "#059669", opacity: 0.6 }} />
        </div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0C1B3A", letterSpacing: "-0.01em" }}>No Overdue Tasks</h2>
        <p style={{ fontSize: "13px", color: "#5B6B8A", marginTop: "6px", fontWeight: 500 }}>You're all caught up! 🎉</p>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up delay-200"
      style={{
        background: "linear-gradient(135deg, #FFF7F7, #FFF1F1)",
        border: "1.5px solid #FECACA",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 2px 16px rgba(239,68,68,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: "rgba(239,68,68,0.08)", filter: "blur(30px)", pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        marginBottom: "20px", paddingBottom: "16px",
        borderBottom: "1px solid rgba(239,68,68,0.15)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "14px",
          background: "linear-gradient(135deg, #EF4444, #F87171)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
        }}>
          <AlertCircle style={{ width: 22, height: 22, color: "#fff" }} />
        </div>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#991B1B", letterSpacing: "-0.01em" }}>Overdue Tasks</h2>
          <p style={{ fontSize: "13px", fontWeight: 500, color: "#B91C1C", marginTop: "2px" }}>
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} require{tasks.length === 1 ? "s" : ""} attention
          </p>
        </div>
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative", zIndex: 1 }}>
        {tasks.map((task, idx) => {
          const daysOverdue = Math.floor((new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
          return (
            <Link
              key={task._id}
              to={`/tasks/${task._id}`}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${idx * 60 + 200}ms`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "12px",
                padding: "14px 16px",
                borderRadius: "14px",
                background: "#fff",
                border: "1px solid #FECACA",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#F87171";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(239,68,68,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#FECACA";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#991B1B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task.title}
                </p>
                {task.project && (
                  <p style={{ fontSize: "11px", fontWeight: 500, color: "#DC2626", opacity: 0.7, marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.project.title}
                  </p>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  padding: "3px 10px", borderRadius: "99px",
                  fontSize: "10px", fontWeight: 700,
                  background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
                  textTransform: "uppercase", letterSpacing: "0.04em",
                }}>
                  <Clock style={{ width: 10, height: 10 }} />
                  {daysOverdue}d late
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default OverdueAlert;
