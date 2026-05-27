import { Link } from "react-router-dom";
import TaskStatusBadge from "../tasks/TaskStatusBadge";
import { ClipboardList, Users2, ArrowRight } from "lucide-react";

const RecentTasksList = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        className="animate-fade-in-up"
        style={{
          background: "#fff",
          border: "1.5px solid #D8E3FF",
          borderRadius: "20px",
          padding: "48px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
        }}
      >
        <div style={{
          width: "56px", height: "56px", borderRadius: "18px",
          background: "linear-gradient(135deg, #EBF0FF, #D8E3FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          <ClipboardList style={{ width: 28, height: 28, color: "#1E5FFF", opacity: 0.5 }} />
        </div>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0C1B3A", letterSpacing: "-0.01em" }}>No Recent Tasks</h2>
        <p style={{ fontSize: "13px", color: "#5B6B8A", marginTop: "6px", fontWeight: 500, maxWidth: "280px" }}>
          Tasks assigned across your workspaces will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: "#fff",
        border: "1.5px solid #D8E3FF",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", paddingBottom: "16px",
        borderBottom: "1px solid #EBF0FF",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "10px",
            background: "linear-gradient(135deg, #1E5FFF, #60A5FA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(30,95,255,0.3)",
          }}>
            <ClipboardList style={{ width: 16, height: 16, color: "#fff" }} />
          </div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0C1B3A", letterSpacing: "-0.01em" }}>Recent Tasks</h2>
        </div>
        <Link
          to="/tasks"
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "12px", fontWeight: 600,
            color: "#1E5FFF",
            textDecoration: "none",
            padding: "4px 10px",
            borderRadius: "8px",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#EBF0FF"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          View all <ArrowRight style={{ width: 12, height: 12 }} />
        </Link>
      </div>

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {tasks.map((task, idx) => (
          <Link
            key={task._id}
            to={`/tasks/${task._id}`}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${idx * 50}ms`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "14px",
              background: "#F8FAFF",
              border: "1px solid transparent",
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.border = "1px solid #D8E3FF";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(30,95,255,0.08)";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "#F8FAFF";
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#0C1B3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {task.title}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}>
                {task.project && (
                  <span style={{ fontSize: "11px", fontWeight: 500, color: "#5B6B8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.project.title}
                  </span>
                )}
                {task.project && task.team && <span style={{ color: "#D8E3FF", fontSize: "11px" }}>·</span>}
                {task.team && (
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "11px", fontWeight: 600, color: "#1E5FFF" }}>
                    <Users2 style={{ width: 11, height: 11 }} />
                    {task.team.name}
                  </span>
                )}
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <TaskStatusBadge status={task.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentTasksList;
