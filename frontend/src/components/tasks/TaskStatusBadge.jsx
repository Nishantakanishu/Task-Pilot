import { TASK_STATUS } from "../../constants";

const TaskStatusBadge = ({ status }) => {
  const configs = {
    [TASK_STATUS.TODO]: {
      label: "To Do",
      bg: "#EBF0FF",
      color: "#1E5FFF",
      dot: "#1E5FFF",
      border: "#B8CCFF",
    },
    [TASK_STATUS.IN_PROGRESS]: {
      label: "In Progress",
      bg: "#FFF3E8",
      color: "#FF7A1A",
      dot: "#FF7A1A",
      border: "#FFD4A8",
    },
    [TASK_STATUS.DONE]: {
      label: "Done",
      bg: "#ECFDF5",
      color: "#059669",
      dot: "#059669",
      border: "#A7F3D0",
    },
  };

  const cfg = configs[status] || {
    label: "Unknown",
    bg: "#F1F5F9",
    color: "#64748B",
    dot: "#94A3B8",
    border: "#E2E8F0",
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "99px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "5px",
          height: "5px",
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
          boxShadow: `0 0 4px ${cfg.dot}`,
          animation: status === TASK_STATUS.IN_PROGRESS ? "bounceDot 1.4s ease-in-out infinite" : "none",
        }}
      />
      {cfg.label}
    </span>
  );
};

export default TaskStatusBadge;
