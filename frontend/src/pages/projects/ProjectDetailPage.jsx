import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import DetailSectionCard from "../../components/layout/DetailSectionCard";
import ModalShell from "../../components/layout/ModalShell";
import TaskCard from "../../components/tasks/TaskCard";
import CreateTaskForm from "../../components/forms/CreateTaskForm";
import TeamCard from "../../components/team/TeamCard";
import TeamFormModal from "../../components/team/TeamFormModal";
import ConfirmDeleteModal from "../../components/team/ConfirmDeleteModal";
import {
  Loader2,
  Plus,
  FolderKanban,
  CheckSquare,
  Calendar,
  User,
  Users2,
  ArrowRight,
} from "lucide-react";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes, teamsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
        api.get(`/projects/${id}/teams`),
      ]);

      setProject(projectRes.data.data);
      setTasks(tasksRes.data.data);
      setTeams(teamsRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Workspace not found");
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTaskCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
    setShowTaskForm(false);
  };

  const handleSaveTeam = (savedTeam, isEdit) => {
    if (isEdit) {
      setTeams((prev) =>
        prev.map((team) => (team._id === savedTeam._id ? savedTeam : team))
      );
    } else {
      setTeams((prev) => [savedTeam, ...prev]);
    }

    setShowCreateTeamModal(false);
    setEditingTeam(null);
  };

  const handleDeleteTeamConfirm = async () => {
    if (!deletingTeam) return;

    setDeleteLoading(true);
    try {
      await api.delete(`/projects/${id}/teams/${deletingTeam._id}`);
      setTeams((prev) => prev.filter((team) => team._id !== deletingTeam._id));
      toast.success("Team deleted");
      setDeletingTeam(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete team");
    } finally {
      setDeleteLoading(false);
    }
  };

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "DONE").length,
    [tasks]
  );

  const totalTeamMembers = useMemo(
    () => teams.reduce((acc, team) => acc + (team.members?.length || 0), 0),
    [teams]
  );

  const tabs = useMemo(
    () => [
      { id: "overview", label: "Overview" },
      { id: "teams", label: `Teams (${teams.length})` },
      { id: "tasks", label: `Tasks (${tasks.length})` },
    ],
    [teams.length, tasks.length]
  );

  if (loading) {
    return (
      <ManagementPageShell
        eyebrow="Workspace detail"
        title="Loading workspace"
        description="We are gathering the teams and tasks for this workspace."
        icon={<FolderKanban className="w-5 h-5" />}
      >
        <div className="section-state animate-scale-in">
          <div className="section-state__icon animate-spin-slow">
            <Loader2 className="w-7 h-7" />
          </div>
          <p className="section-state__title">Loading workspace</p>
          <p className="section-state__text">
            We are arranging the workspace overview, team roster, and task list.
          </p>
        </div>
      </ManagementPageShell>
    );
  }

  if (!project) return null;

  const breadcrumbs = (
    <>
      <Link to="/projects">Workspaces</Link>
      <span className="page-hero__breadcrumbs-separator">/</span>
      <span>{project.title}</span>
    </>
  );

  const toolbar = (
    <div className="detail-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={`detail-tab ${activeTab === tab.id ? "detail-tab--active" : ""}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <ManagementPageShell
        eyebrow="Workspace detail"
        title={project.title}
        description={
          project.description ||
          "Teams, ownership, and tasks are organized here so the workspace stays easy to scan."
        }
        icon={<FolderKanban className="w-5 h-5" />}
        breadcrumbs={breadcrumbs}
        stats={[
          {
            label: "Teams",
            value: teams.length,
            hint: "in this workspace",
            accent: "#8B5CF6",
          },
          {
            label: "Members",
            value: totalTeamMembers,
            hint: "assigned people",
            accent: "#1E5FFF",
          },
          {
            label: "Tasks",
            value: tasks.length,
            hint: "tracked tasks",
            accent: "#FF7A1A",
          },
          {
            label: "Completed",
            value: completedTasks,
            hint: "done work",
            accent: "#059669",
          },
        ]}
        action={
          isAdmin ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setEditingTeam(null);
                  setShowCreateTeamModal(true);
                }}
                className="btn-ghost"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 18px",
                  fontSize: "13px",
                }}
              >
                <Plus className="w-4 h-4" />
                New Team
              </button>
              <button
                onClick={() => setShowTaskForm(true)}
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
            </div>
          ) : null
        }
        toolbar={toolbar}
      >
        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_340px] gap-6">
            <div className="space-y-6">
              <DetailSectionCard
                title="Teams"
                description={`${teams.length} team${teams.length !== 1 ? "s" : ""} in this workspace`}
                icon={<Users2 className="w-5 h-5" />}
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab("teams")}
                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    View all →
                  </button>
                }
              >
                {teams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/40">
                    <Users2 className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-text-primary">No teams yet</p>
                    <p className="text-xs text-text-secondary mt-1">
                      Create teams to organize workspace collaboration
                    </p>
                    {isAdmin ? (
                      <button
                        onClick={() => {
                          setEditingTeam(null);
                          setShowCreateTeamModal(true);
                        }}
                        className="mt-3 px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Create First Team
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {teams.slice(0, 5).map((team) => (
                      <Link
                        key={team._id}
                        to={`/projects/${id}/teams/${team._id}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200 no-underline"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                            <Users2 className="w-4 h-4 text-violet-500" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                              {team.name}
                            </span>
                            <span className="text-[11px] text-text-secondary">
                              {team.members?.length || 0} member
                              {(team.members?.length || 0) !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    ))}
                    {teams.length > 5 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab("teams")}
                        className="w-full text-center text-xs font-semibold text-primary hover:text-primary-hover py-2 transition-colors"
                      >
                        +{teams.length - 5} more team{teams.length - 5 !== 1 ? "s" : ""} →
                      </button>
                    ) : null}
                  </div>
                )}
              </DetailSectionCard>

              <DetailSectionCard
                title="Recent Tasks"
                description={`${tasks.length} task${tasks.length !== 1 ? "s" : ""} total`}
                icon={<CheckSquare className="w-5 h-5" />}
                action={
                  <button
                    type="button"
                    onClick={() => setActiveTab("tasks")}
                    className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    View all →
                  </button>
                }
              >
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-gray-50/40">
                    <CheckSquare className="w-8 h-8 text-gray-300 mb-3" />
                    <p className="text-sm font-semibold text-text-primary">No tasks yet</p>
                    <p className="text-xs text-text-secondary mt-1">
                      Tasks created in this workspace will appear here
                    </p>
                    {isAdmin ? (
                      <button
                        type="button"
                        onClick={() => setShowTaskForm(true)}
                        className="mt-3 px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Create First Task
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {tasks.slice(0, 5).map((task) => (
                      <Link
                        key={task._id}
                        to={`/tasks/${task._id}`}
                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200 no-underline"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              task.status === "DONE"
                                ? "bg-emerald-500"
                                : task.status === "IN_PROGRESS"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold uppercase bg-gray-100 text-text-secondary px-1.5 py-0.5 rounded">
                                {task.status?.replace("_", " ")}
                              </span>
                              {task.assignedTo ? (
                                <span className="text-[11px] text-text-secondary">
                                  {task.assignedTo.name}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" />
                      </Link>
                    ))}
                    {tasks.length > 5 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab("tasks")}
                        className="w-full text-center text-xs font-semibold text-primary hover:text-primary-hover py-2 transition-colors"
                      >
                        +{tasks.length - 5} more task{tasks.length - 5 !== 1 ? "s" : ""} →
                      </button>
                    ) : null}
                  </div>
                )}
              </DetailSectionCard>
            </div>

            <div className="space-y-6">
              <DetailSectionCard
                title="Workspace info"
                description="Project metadata and ownership."
                icon={<FolderKanban className="w-5 h-5" />}
              >
                <p className="text-sm text-text-secondary leading-relaxed pb-6 border-b border-gray-100">
                  {project.description || "No description provided for this workspace."}
                </p>

                <div className="space-y-4 pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                      <User className="w-4.5 h-4.5 text-gray-400" />
                      Created by
                    </div>
                    <span className="text-sm font-semibold text-text-primary text-right truncate max-w-[180px]">
                      {project.createdBy?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                      <Calendar className="w-4.5 h-4.5 text-gray-400" />
                      Created on
                    </div>
                    <span className="text-sm font-semibold text-text-primary text-right">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                      <Users2 className="w-4.5 h-4.5 text-gray-400" />
                      Teams
                    </div>
                    <span className="text-sm font-bold text-text-primary bg-gray-50 px-2.5 py-1 rounded-lg">
                      {teams.length}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                      <CheckSquare className="w-4.5 h-4.5 text-gray-400" />
                      Tasks
                    </div>
                    <span className="text-sm font-bold text-text-primary bg-gray-50 px-2.5 py-1 rounded-lg">
                      {tasks.length}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                      <FolderKanban className="w-4.5 h-4.5 text-gray-400" />
                      Workspace ID
                    </div>
                    <span className="text-xs font-mono text-text-secondary bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 truncate max-w-[180px]">
                      {project._id}
                    </span>
                  </div>
                </div>
              </DetailSectionCard>

              <DetailSectionCard
                title="Quick navigation"
                description="Jump straight to the section you need."
                icon={<ArrowRight className="w-5 h-5" />}
              >
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("teams")}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-violet-50 transition-colors group border border-transparent hover:border-violet-100 text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:text-violet-700">
                      <Users2 className="w-4 h-4 text-violet-500" />
                      Teams
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tasks")}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group border border-transparent hover:border-blue-100 text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:text-blue-700">
                      <CheckSquare className="w-4 h-4 text-blue-500" />
                      All Tasks
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </button>
                  <Link
                    to={`/tasks?project=${id}`}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors group border border-transparent hover:border-orange-100 text-left no-underline"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:text-orange-700">
                      <FolderKanban className="w-4 h-4 text-orange-500" />
                      Filtered tasks page
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
                  </Link>
                </div>
              </DetailSectionCard>
            </div>
          </div>
        ) : activeTab === "teams" ? (
          <DetailSectionCard
            title="Workspace Teams"
            description={`${teams.length} team${teams.length !== 1 ? "s" : ""} in this workspace`}
            icon={<Users2 className="w-5 h-5" />}
            action={
              isAdmin ? (
                <button
                  onClick={() => {
                    setEditingTeam(null);
                    setShowCreateTeamModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Team
                </button>
              ) : null
            }
          >
            {teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4">
                  <Users2 className="w-7 h-7 text-violet-500" />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-1">No teams yet</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  Create teams to organize members and assign tasks effectively.
                </p>
                {isAdmin ? (
                  <button
                    onClick={() => {
                      setEditingTeam(null);
                      setShowCreateTeamModal(true);
                    }}
                    className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Create First Team
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="responsive-card-grid">
                {teams.map((team) => (
                  <TeamCard
                    key={team._id}
                    team={team}
                    isAdmin={isAdmin}
                    projectId={id}
                    onEdit={(nextTeam) => {
                      setEditingTeam(nextTeam);
                      setShowCreateTeamModal(true);
                    }}
                    onDelete={(nextTeam) => setDeletingTeam(nextTeam)}
                  />
                ))}
              </div>
            )}
          </DetailSectionCard>
        ) : (
          <DetailSectionCard
            title="Workspace Tasks"
            description={`${tasks.length} task${tasks.length !== 1 ? "s" : ""} · ${completedTasks} completed`}
            icon={<CheckSquare className="w-5 h-5" />}
            action={
              isAdmin ? (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  New Task
                </button>
              ) : null
            }
          >
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <CheckSquare className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-text-primary font-semibold text-base">No tasks yet</p>
                <p className="text-text-secondary text-sm mt-1 max-w-xs">
                  Create tasks and assign them to teams to start organizing work.
                </p>
                {isAdmin ? (
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                  >
                    Create First Task
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="responsive-card-grid">
                {tasks.map((task, index) => (
                  <TaskCard key={task._id} task={task} index={index} />
                ))}
              </div>
            )}
          </DetailSectionCard>
        )}
      </ManagementPageShell>

      {showTaskForm ? (
        <ModalShell
          title="Create Task"
          eyebrow="New task"
          description="Add a task, pick the right team, and assign it to the right person."
          icon={<CheckSquare className="w-5 h-5" />}
          onClose={() => setShowTaskForm(false)}
          maxWidth="640px"
        >
          <CreateTaskForm
            onSuccess={handleTaskCreated}
            onCancel={() => setShowTaskForm(false)}
            prefilledProject={id}
            prefilledProjectTitle={project.title}
          />
        </ModalShell>
      ) : null}

      {showCreateTeamModal ? (
        <TeamFormModal
          projectId={id}
          initial={editingTeam}
          onClose={() => {
            setShowCreateTeamModal(false);
            setEditingTeam(null);
          }}
          onSave={handleSaveTeam}
        />
      ) : null}

      {deletingTeam ? (
        <ConfirmDeleteModal
          team={deletingTeam}
          loading={deleteLoading}
          onClose={() => setDeletingTeam(null)}
          onConfirm={handleDeleteTeamConfirm}
        />
      ) : null}
    </>
  );
};

export default ProjectDetailPage;
