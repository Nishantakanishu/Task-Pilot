import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import DetailSectionCard from "../../components/layout/DetailSectionCard";
import UpdateTaskStatusForm from "../../components/forms/UpdateTaskStatusForm";
import {
  Loader2,
  Trash2,
  Users2,
  CheckSquare,
  Calendar,
  FolderKanban,
  User,
} from "lucide-react";

const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return "No due date";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Task not found");
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      navigate("/tasks");
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const canUpdateStatus = useMemo(
    () => task?.assignedTo?._id === user?._id,
    [task, user]
  );

  const projectId = task?.project?._id || task?.project;
  const teamId = task?.team?._id || task?.team;
  const teamProjectId = task?.team?.project?._id || projectId;

  if (loading) {
    return (
      <ManagementPageShell
        eyebrow="Task detail"
        title="Loading task"
        description="We are gathering the task summary and ownership details."
        icon={<CheckSquare className="w-5 h-5" />}
      >
        <div className="section-state animate-scale-in">
          <div className="section-state__icon animate-spin-slow">
            <Loader2 className="w-7 h-7" />
          </div>
          <p className="section-state__title">Loading task</p>
          <p className="section-state__text">
            We are arranging the task description, status, and owner.
          </p>
        </div>
      </ManagementPageShell>
    );
  }

  if (!task) return null;

  const projectTitle = task.project?.title || "Workspace";
  const teamTitle = task.team?.name || null;
  const assigneeName = task.assignedTo?.name || "Unassigned";

  return (
    <ManagementPageShell
      eyebrow="Task detail"
      title={task.title}
      description={[
        projectTitle,
        teamTitle,
        task.assignedTo?.name ? `Assigned to ${task.assignedTo.name}` : "Unassigned",
      ]
        .filter(Boolean)
        .join(" • ")}
      icon={<CheckSquare className="w-5 h-5" />}
      breadcrumbs={
        <>
          <Link to="/tasks">Tasks</Link>
          <span className="page-hero__breadcrumbs-separator">/</span>
          {task.project ? (
            <>
              <Link to={`/projects/${projectId}`}>{projectTitle}</Link>
              <span className="page-hero__breadcrumbs-separator">/</span>
            </>
          ) : null}
          <span>{task.title}</span>
        </>
      }
      stats={[
        {
          label: "Status",
          value: (task.status || "Unknown").replaceAll("_", " "),
          hint: "current progress",
          accent: "#1E5FFF",
        },
        {
          label: "Priority",
          value: task.priority || "Unset",
          hint: "task urgency",
          accent:
            task.priority === "HIGH"
              ? "#EF4444"
              : task.priority === "MEDIUM"
              ? "#F59E0B"
              : "#059669",
        },
        {
          label: "Due",
          value: formatDate(task.dueDate),
          hint: task.dueDate ? "deadline" : "no deadline",
          accent: "#FF7A1A",
        },
        {
          label: "Assignee",
          value: assigneeName,
          hint: "current owner",
          accent: "#8B5CF6",
        },
      ]}
      action={
        isAdmin ? (
          <button
            onClick={handleDelete}
            className="text-sm font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 border border-transparent hover:border-red-100 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete Task
          </button>
        ) : null
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_340px] gap-6">
        <div className="space-y-6">
          <DetailSectionCard
            title="Description"
            description="The task brief lives here so the full context stays easy to scan."
            icon={<CheckSquare className="w-5 h-5" />}
          >
            {task.description ? (
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </div>
            ) : (
              <p className="text-text-secondary text-sm italic">
                No description provided.
              </p>
            )}
          </DetailSectionCard>
        </div>

        <div className="space-y-6">
          {canUpdateStatus ? (
            <UpdateTaskStatusForm task={task} onUpdate={setTask} />
          ) : null}

          <DetailSectionCard
            title="Task details"
            description="Workspace, ownership, and reference data."
            icon={<FolderKanban className="w-5 h-5" />}
          >
            <div className="space-y-4">
              {task.project ? (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <FolderKanban className="w-4 h-4 text-gray-400" />
                    Workspace
                  </div>
                  <Link
                    to={`/projects/${projectId}`}
                    className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors text-right truncate max-w-[180px]"
                  >
                    {projectTitle}
                  </Link>
                </div>
              ) : null}

              {teamId ? (
                <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <Users2 className="w-4 h-4 text-violet-500" />
                    Team
                  </div>
                  <Link
                    to={`/projects/${teamProjectId}/teams/${teamId}`}
                    className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors text-right truncate max-w-[180px]"
                  >
                    {teamTitle || "Team"}
                  </Link>
                </div>
              ) : null}

              <div
                className={`flex items-start justify-between gap-4 ${
                  teamId ? "pt-4 border-t border-gray-100" : ""
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <User className="w-4 h-4 text-gray-400" />
                  Assigned to
                </div>
                <div className="text-right min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate max-w-[180px]">
                    {task.assignedTo?.name || "Unassigned"}
                  </p>
                  {task.assignedTo?.email ? (
                    <p className="text-xs text-text-secondary truncate max-w-[180px]">
                      {task.assignedTo.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Due date
                </div>
                <p className="text-sm font-semibold text-text-primary text-right">
                  {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <CheckSquare className="w-4 h-4 text-gray-400" />
                  Priority
                </div>
                <p
                  className={`text-sm font-bold uppercase tracking-wider text-right ${
                    task.priority === "HIGH"
                      ? "text-red-600"
                      : task.priority === "MEDIUM"
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {task.priority || "Unset"}
                </p>
              </div>

              <div className="flex items-start justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                  <User className="w-4 h-4 text-gray-400" />
                  Created by
                </div>
                <p className="text-sm font-semibold text-text-primary text-right truncate max-w-[180px]">
                  {task.createdBy?.name || "Unknown"}
                </p>
              </div>
            </div>
          </DetailSectionCard>
        </div>
      </div>
    </ManagementPageShell>
  );
};

export default TaskDetailPage;
