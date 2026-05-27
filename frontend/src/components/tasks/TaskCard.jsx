import { Link } from "react-router-dom";
import TaskStatusBadge from "./TaskStatusBadge";
import { TASK_PRIORITY } from "../../constants";
import { Calendar, AlertCircle, Users2, AlertTriangle, ArrowRight, FolderKanban } from "lucide-react";

const TaskCard = ({ task, index = 0 }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const isOverdue =
    task.status !== "DONE" && task.dueDate && new Date(task.dueDate) < new Date();

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case TASK_PRIORITY.HIGH:
        return { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", label: "High" };
      case TASK_PRIORITY.MEDIUM:
        return { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", label: "Medium" };
      case TASK_PRIORITY.LOW:
        return { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Low" };
      default:
        return { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", label: priority };
    }
  };

  const priority = getPriorityConfig(task.priority);

  return (
    <div
      className={`entity-card card-hover group ${
        isOverdue ? "border-red-200" : ""
      } animate-fade-in-up`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="entity-card__glow" />

      {isOverdue && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 relative z-1">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Overdue
        </div>
      )}

      <div className="flex items-start justify-between gap-3 relative z-1">
        <div className="min-w-0 flex-1">
          <Link to={`/tasks/${task._id}`} className="no-underline">
            <h3 className="entity-card__title truncate group-hover:text-primary transition-colors">
              {task.title}
            </h3>
          </Link>

          <div className="mt-2 flex flex-wrap gap-2">
            {task.project && (
              <span className="entity-card__chip">
                <FolderKanban className="w-3.5 h-3.5" />
                {task.project.title}
              </span>
            )}
            {task.team && (
              <span className="entity-card__chip">
                <Users2 className="w-3.5 h-3.5" />
                {task.team.name}
              </span>
            )}
          </div>
        </div>

        <TaskStatusBadge status={task.status} />
      </div>

      <p className="entity-card__description line-clamp-3">
        {task.description || "No description provided for this task."}
      </p>

      <div className="entity-card__meta">
        <span
          className="entity-card__chip"
          style={
            isOverdue
              ? {
                  background: "#FEF2F2",
                  color: "#DC2626",
                  borderColor: "#FECACA",
                }
              : undefined
          }
        >
          <Calendar className="w-3 h-3" />
          Due {formatDate(task.dueDate)}
        </span>

        <span
          className="entity-card__chip"
          style={{
            background: priority.bg,
            color: priority.text,
            borderColor: priority.border,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
          }}
        >
          <AlertCircle className="w-3 h-3" />
          {priority.label}
        </span>

        {isOverdue ? (
          <span
            className="entity-card__chip"
            style={{
              background: "#FEF2F2",
              color: "#DC2626",
              borderColor: "#FECACA",
            }}
          >
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        ) : null}
      </div>

      <div className="entity-card__footer">
        <div className="entity-card__footer-meta">
          {task.assignedTo ? (
            <>
              <div
                title={task.assignedTo.name}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0 shadow-sm"
              >
                {task.assignedTo.name.charAt(0)}
              </div>
              <span className="text-xs text-text-secondary font-medium truncate max-w-[110px]">
                {task.assignedTo.name}
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-gray-400 italic">
              Unassigned
            </span>
          )}
        </div>

        <Link
          to={`/tasks/${task._id}`}
          className="entity-card__cta"
          style={{ textDecoration: "none" }}
        >
          Open
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
