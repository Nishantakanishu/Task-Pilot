import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import ModalShell from "../../components/layout/ModalShell";
import TaskCard from "../../components/tasks/TaskCard";
import CreateTaskForm from "../../components/forms/CreateTaskForm";
import { TASK_STATUS } from "../../constants";
import {
  CheckSquare,
  ClipboardList,
  Filter,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

const STATUS_LABELS = {
  [TASK_STATUS.TODO]: "To Do",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.DONE]: "Done",
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: TASK_STATUS.TODO, label: STATUS_LABELS[TASK_STATUS.TODO] },
  { value: TASK_STATUS.IN_PROGRESS, label: STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
  { value: TASK_STATUS.DONE, label: STATUS_LABELS[TASK_STATUS.DONE] },
];

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

const isObjectId = (value) => OBJECT_ID_PATTERN.test(value);

const shortenId = (value) => {
  if (!value) return "";
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
};

const isOverdue = (task) =>
  task.status !== TASK_STATUS.DONE &&
  task.dueDate &&
  new Date(task.dueDate).getTime() < Date.now();

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [contextProject, setContextProject] = useState(null);
  const [contextTeam, setContextTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);

  const searchParamsKey = searchParams.toString();

  const rawFilters = useMemo(
    () => ({
      project: searchParams.get("project") || "",
      team: searchParams.get("team") || "",
      status: searchParams.get("status") || "",
      assignedTo: searchParams.get("assignedTo") || "",
    }),
    [searchParamsKey]
  );

  const filters = useMemo(
    () => ({
      project: isObjectId(rawFilters.project) ? rawFilters.project : "",
      team: isObjectId(rawFilters.team) ? rawFilters.team : "",
      status: Object.values(TASK_STATUS).includes(rawFilters.status)
        ? rawFilters.status
        : "",
      assignedTo: isObjectId(rawFilters.assignedTo) ? rawFilters.assignedTo : "",
    }),
    [rawFilters]
  );

  const hasBackendFilters = Boolean(
    filters.project || filters.team || filters.status || filters.assignedTo
  );

  useEffect(() => {
    let isActive = true;

    const loadTasks = async () => {
      setLoading(true);

      const params = {};
      if (filters.project) params.project = filters.project;
      if (filters.team) params.team = filters.team;
      if (filters.status) params.status = filters.status;
      if (filters.assignedTo) params.assignedTo = filters.assignedTo;

      try {
        const [tasksRes, projectRes, teamRes] = await Promise.all([
          api.get("/tasks", { params }),
          filters.project
            ? api.get(`/projects/${filters.project}`).catch(() => null)
            : Promise.resolve(null),
          filters.project && filters.team
            ? api
                .get(`/projects/${filters.project}/teams/${filters.team}`)
                .catch(() => null)
            : Promise.resolve(null),
        ]);

        if (!isActive) return;

        setTasks(tasksRes.data.data || []);
        setContextProject(projectRes?.data?.data || null);
        setContextTeam(teamRes?.data?.data || null);
      } catch (err) {
        if (!isActive) return;
        toast.error(err.response?.data?.message || "Failed to load tasks");
        setTasks([]);
        setContextProject(null);
        setContextTeam(null);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadTasks();

    return () => {
      isActive = false;
    };
  }, [filters, refreshIndex]);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) => {
      const searchableFields = [
        task.title,
        task.description,
        task.project?.title,
        task.team?.name,
        task.assignedTo?.name,
        task.assignedTo?.email,
        STATUS_LABELS[task.status] || task.status,
        task.priority,
        task.status?.replaceAll("_", " "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableFields.includes(query);
    });
  }, [tasks, searchQuery]);

  const visibleOverdueTasks = useMemo(
    () => filteredTasks.filter(isOverdue).length,
    [filteredTasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === TASK_STATUS.DONE).length,
    [tasks]
  );

  const activeFilters = useMemo(() => {
    const chips = [];

    if (filters.project) {
      chips.push({
        key: "project",
        label: `Workspace: ${contextProject?.title || shortenId(filters.project)}`,
      });
    }

    if (filters.team) {
      chips.push({
        key: "team",
        label: `Team: ${contextTeam?.name || shortenId(filters.team)}`,
      });
    }

    if (filters.status) {
      chips.push({
        key: "status",
        label: `Status: ${STATUS_LABELS[filters.status] || filters.status}`,
      });
    }

    if (filters.assignedTo) {
      chips.push({
        key: "assignedTo",
        label: `Assignee: ${shortenId(filters.assignedTo)}`,
      });
    }

    return chips;
  }, [filters, contextProject, contextTeam]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSearchParams({}, { replace: true });
  };

  const updateStatusFilter = (nextStatus) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextStatus) {
      nextParams.set("status", nextStatus);
    } else {
      nextParams.delete("status");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const removeFilter = (key) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(key);
    setSearchParams(nextParams, { replace: true });
  };

  const handleTaskCreated = () => {
    setShowCreateTaskModal(false);
    setRefreshIndex((current) => current + 1);
  };

  const emptyState = useMemo(() => {
    if (tasks.length === 0) {
      if (hasBackendFilters) {
        return {
          title: "No matching tasks",
          text: "The current workspace or team filter did not return any tasks.",
          actionLabel: "Clear filters",
          action: clearAllFilters,
        };
      }

      return isAdmin
        ? {
            title: "No tasks yet",
            text: "Create the first task to start planning work across your teams.",
            actionLabel: "Create task",
            action: () => setShowCreateTaskModal(true),
          }
        : {
            title: "No tasks yet",
            text: "You have not been assigned any tasks yet.",
            actionLabel: null,
            action: null,
          };
    }

    if (filteredTasks.length === 0) {
      return {
        title: "No matching tasks",
        text: "Try a different search term or clear the current filters.",
        actionLabel: searchQuery.trim() ? "Clear search" : "Reset view",
        action: searchQuery.trim() ? () => setSearchQuery("") : clearAllFilters,
      };
    }

    return null;
  }, [tasks.length, filteredTasks.length, hasBackendFilters, isAdmin, searchQuery]);

  const pageStats = useMemo(
    () => [
      {
        label: "Total tasks",
        value: tasks.length,
        hint: hasBackendFilters ? "after filters" : "available now",
        accent: "#1E5FFF",
      },
      {
        label: "Visible now",
        value: filteredTasks.length,
        hint: searchQuery.trim() ? "matching search" : "on screen",
        accent: "#FF7A1A",
      },
      {
        label: "Overdue",
        value: visibleOverdueTasks,
        hint: "need attention",
        accent: "#EF4444",
      },
      {
        label: "Completed",
        value: completedTasks,
        hint: "done tasks",
        accent: "#059669",
      },
    ],
    [
      tasks.length,
      filteredTasks.length,
      searchQuery,
      visibleOverdueTasks,
      completedTasks,
      hasBackendFilters,
    ]
  );

  const toolbar = (
    <div className="space-y-3">
      <div className="toolbar-row toolbar-row--between">
        <div className="toolbar-control toolbar-control--search">
          <Search className="toolbar-control__icon h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks, teams, people, or priorities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="toolbar-control__input"
          />
        </div>

        <div className="toolbar-row" style={{ marginLeft: "auto" }}>
          <div className="toolbar-control toolbar-control--select">
            <Filter className="toolbar-control__icon h-4 w-4" />
            <select
              value={filters.status}
              onChange={(e) => updateStatusFilter(e.target.value)}
              className="toolbar-control__select"
              aria-label="Filter tasks by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {(searchQuery || hasBackendFilters) && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn-ghost"
              style={{
                padding: "0 16px",
                minHeight: "48px",
                fontSize: "13px",
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="toolbar-row toolbar-row--between">
        <p className="toolbar-meta">
          {loading
            ? "Loading tasks..."
            : `${filteredTasks.length} task${
                filteredTasks.length === 1 ? "" : "s"
              } visible`}
        </p>

        {activeFilters.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => removeFilter(filter.key)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid #D8E3FF",
                  background: "#EBF0FF",
                  color: "#1E5FFF",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <span>{filter.label}</span>
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <ManagementPageShell
        eyebrow="Work planning"
        title="Tasks"
        description={
          isAdmin
            ? "Track every task across your workspaces, filter what matters, and create new work items in one place."
            : "Review the tasks assigned to you or your team and stay on top of upcoming deadlines."
        }
        icon={<CheckSquare className="w-5 h-5" />}
        action={
          isAdmin ? (
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="btn-primary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 18px",
                fontSize: "13px",
              }}
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          ) : null
        }
        stats={pageStats}
        toolbar={toolbar}
      >
        {loading ? (
          <div className="section-state animate-scale-in">
            <div className="section-state__icon animate-spin-slow">
              <Loader2 className="w-7 h-7" />
            </div>
            <p className="section-state__title">Loading tasks</p>
            <p className="section-state__text">
              We are gathering the latest tasks and arranging them for review.
            </p>
          </div>
        ) : emptyState ? (
          <div className="section-state animate-scale-in">
            <div className="section-state__icon">
              {searchQuery.trim() || hasBackendFilters ? (
                <Search className="w-9 h-9" />
              ) : (
                <ClipboardList className="w-9 h-9" />
              )}
            </div>
            <p className="section-state__title">{emptyState.title}</p>
            <p className="section-state__text">{emptyState.text}</p>
            {emptyState.actionLabel && emptyState.action ? (
              <button
                type="button"
                onClick={emptyState.action}
                className={emptyState.actionLabel === "Create task" ? "btn-primary" : "btn-ghost"}
                style={{
                  marginTop: "24px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {emptyState.actionLabel === "Create task" ? (
                  <Plus className="w-4 h-4" />
                ) : null}
                {emptyState.actionLabel}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="responsive-card-grid animate-fade-in-up">
            {filteredTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
          </div>
        )}
      </ManagementPageShell>

      {showCreateTaskModal && (
        <ModalShell
          title="Create Task"
          eyebrow="New task"
          description="Add a task, pick the right team, and assign it to the right person."
          icon={<CheckSquare className="w-5 h-5" />}
          onClose={() => setShowCreateTaskModal(false)}
          maxWidth="640px"
        >
          <CreateTaskForm
            onSuccess={handleTaskCreated}
            onCancel={() => setShowCreateTaskModal(false)}
            prefilledProject={filters.project || null}
            prefilledProjectTitle={contextProject?.title || ""}
          />
        </ModalShell>
      )}
    </>
  );
};

export default TasksPage;
