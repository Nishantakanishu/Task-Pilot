import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { TASK_PRIORITY } from "../../constants";
import { Loader2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(1000).optional(),
  project: z.string().min(1, "Project is required"),
  team: z.string().min(1, "Team is required"),
  assignedTo: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.nativeEnum(TASK_PRIORITY).default(TASK_PRIORITY.MEDIUM),
});

const CreateTaskForm = ({ onSuccess, onCancel, prefilledProject = null, prefilledProjectTitle = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      project: prefilledProject || "",
    },
  });

  const selectedProject = watch("project");

  // Ensure prefilled project is explicitly set
  useEffect(() => {
    if (prefilledProject) {
      setValue("project", prefilledProject, { shouldValidate: true });
    }
  }, [prefilledProject, setValue]);

  // Fetch projects for the dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data.data);
      } catch (err) {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  const selectedTeam = watch("team");

  // Fetch teams when project changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedProject) {
        setTeams([]);
        setValue("team", "");
        return;
      }
      try {
        const { data } = await api.get(`/projects/${selectedProject}/teams`);
        setTeams(data.data);
      } catch (err) {
        setTeams([]);
      }
    };
    fetchTeams();
  }, [selectedProject, setValue]);

  // Fetch team members when team changes
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!selectedTeam) {
        setTeamMembers([]);
        setValue("assignedTo", "");
        return;
      }
      try {
        const { data } = await api.get(`/projects/${selectedProject}/teams/${selectedTeam}/members`);
        setTeamMembers(data.data);
      } catch (err) {
        setTeamMembers([]);
      }
    };
    fetchTeamMembers();
  }, [selectedTeam, selectedProject, setValue]);

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/tasks", formData);
      toast.success("Task created successfully!");
      reset();
      onSuccess?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const surfaceCard = {
    padding: 18,
    borderRadius: 22,
    background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
    border: "1px solid rgba(216,227,255,0.9)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
  };

  const labelClass = "block text-sm font-semibold text-text-primary mb-2";
  const inputClass = (hasError, disabled = false) =>
    `w-full px-4 py-3.5 rounded-xl bg-white border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
      hasError ? "border-red-300 focus:ring-red-500" : "border-[#D8E3FF]"
    } ${disabled ? "bg-[#F8FBFF] opacity-60 cursor-not-allowed" : ""}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={surfaceCard}>
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1E5FFF",
              marginBottom: 4,
            }}
          >
            Task details
          </p>
          <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
            Keep the title short and the description specific so the task stays easy to scan.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className={labelClass}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              className={inputClass(!!errors.title)}
              placeholder="e.g. Design Landing Page"
            />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={4}
              {...register("description")}
              className={inputClass(!!errors.description)}
              style={{ resize: "none" }}
              placeholder="Detailed task description..."
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      <div style={surfaceCard}>
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1E5FFF",
              marginBottom: 4,
            }}
          >
            Assignment
          </p>
          <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
            Choose where this task belongs and who should receive it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Project <span className="text-red-500">*</span>
            </label>
            <select
              {...register("project")}
              disabled={!!prefilledProject}
              className={inputClass(!!errors.project, !!prefilledProject)}
            >
              {prefilledProject ? (
                <option value={prefilledProject}>{prefilledProjectTitle || "Current Project"}</option>
              ) : (
                <>
                  <option value="">Select project...</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))}
                </>
              )}
            </select>
            {errors.project && <p className="mt-1.5 text-xs text-red-500">{errors.project.message}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Team <span className="text-red-500">*</span>
            </label>
            <select
              {...register("team")}
              disabled={!selectedProject}
              className={inputClass(!!errors.team, !selectedProject)}
            >
              <option value="">{selectedProject ? "Select team..." : "Select a project first"}</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
            {errors.team && <p className="mt-1.5 text-xs text-red-500">{errors.team.message}</p>}
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <label className={labelClass}>
            Assign To <span className="text-xs text-text-secondary font-normal">(optional)</span>
          </label>
          <select
            {...register("assignedTo")}
            disabled={!selectedTeam}
            className={inputClass(!!errors.assignedTo, !selectedTeam)}
          >
            <option value="">{selectedTeam ? "Leave unassigned" : "Select a team first"}</option>
            {teamMembers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
          {errors.assignedTo && <p className="mt-1.5 text-xs text-red-500">{errors.assignedTo.message}</p>}
        </div>
      </div>

      <div style={surfaceCard}>
        <div style={{ marginBottom: 14 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1E5FFF",
              marginBottom: 4,
            }}
          >
            Timing
          </p>
          <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
            Set a deadline and choose the task priority.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className={inputClass(!!errors.dueDate)}
            />
            {errors.dueDate && <p className="mt-1.5 text-xs text-red-500">{errors.dueDate.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <select
              {...register("priority")}
              className={inputClass(false)}
            >
              <option value={TASK_PRIORITY.LOW}>Low</option>
              <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
              <option value={TASK_PRIORITY.HIGH}>High</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        borderRadius: 18,
        background: "rgba(30,95,255,0.06)",
        border: "1px solid rgba(30,95,255,0.1)",
        color: "#33527E",
        fontSize: 12.5,
        lineHeight: 1.5,
      }}>
        <span style={{ fontWeight: 800 }}>Tip:</span>
        Pick the project first. Teams and assignees will unlock automatically.
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F8FBFF] font-semibold rounded-xl transition-colors text-sm shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Creating...
            </>
          ) : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default CreateTaskForm;
