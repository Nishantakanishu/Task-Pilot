import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import DetailSectionCard from "../../components/layout/DetailSectionCard";
import ModalShell from "../../components/layout/ModalShell";
import {
  Loader2, Users2, Calendar, User, FolderKanban, Plus,
  MoreVertical, Shield, Trash2, ShieldCheck, Mail, CheckSquare, ListTodo, Search, X
} from "lucide-react";

// ── Format date ────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ── Add Member Modal ──────────────────────────────────────────────────────────
const AddMemberModal = ({ onClose, onAdd, projectId, teamId }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Multi-select state
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [role, setRole] = useState("MEMBER");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [usersRes, projectRes] = await Promise.all([
          api.get(`/projects/users`),
          api.get(`/projects/${projectId}`)
        ]);
        
        // Users who are already in ANY team are synced to project.members
        const projectMemberIds = new Set(projectRes.data.data.members.map(m => m._id));
        
        // Filter out anyone who is already in a team in this workspace
        const available = usersRes.data.data.filter(m => !projectMemberIds.has(m._id));
        setAllUsers(available);
      } catch (err) {
        toast.error("Failed to load users");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [projectId, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) return toast.error("Please select at least one user");

    setSubmitting(true);
    try {
      // Add all selected members in parallel
      await Promise.all(
        selectedMembers.map((member) => 
          api.post(`/projects/${projectId}/teams/${teamId}/members`, {
            userId: member._id,
            role,
          })
        )
      );
      toast.success("Members added to team");
      onAdd();
    } catch (err) {
      toast.error("Failed to add some members");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      title="Add Team Members"
      eyebrow="Team setup"
      description="Search workspace users, select the people you need, and assign a role in one flow."
      icon={<Users2 className="w-5 h-5" />}
      onClose={onClose}
      maxWidth="760px"
      contentPadding="24px"
    >
      {loading ? (
        <div
          style={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : allUsers.length === 0 ? (
        <div
          style={{
            padding: 22,
            borderRadius: 22,
            border: "1px solid rgba(216,227,255,0.9)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div style={{ padding: "8px 0 14px" }}>
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E5FFF", marginBottom: 4 }}>
              No users available
            </p>
            <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.6 }}>
              Everyone who can be added is already on a team in this workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl border border-[#D8E3FF] bg-white text-text-primary font-semibold text-sm transition-colors hover:bg-[#F8FBFF]"
          >
            Close
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
              border: "1px solid rgba(216,227,255,0.9)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E5FFF", marginBottom: 4 }}>
                Select people
              </p>
              <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
                Search by name or email, then add the right people to the team.
              </p>
            </div>

            {selectedMembers.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
                {selectedMembers.map((member) => (
                  <div
                    key={member._id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(30,95,255,0.08)",
                      border: "1px solid rgba(30,95,255,0.14)",
                      color: "#1E5FFF",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <span>{member.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMembers((prev) => prev.filter((m) => m._id !== member._id))}
                      aria-label={`Remove ${member.name}`}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: "none",
                        background: "rgba(30,95,255,0.08)",
                        color: "#1E5FFF",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block text-sm font-semibold text-text-primary mb-2">Search users</label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white border border-[#D8E3FF] text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition"
              />
            </div>

            <div
              style={{
                maxHeight: 220,
                overflowY: "auto",
                borderRadius: 22,
                border: "1px solid rgba(216,227,255,0.9)",
                background: "#fff",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
            >
              {allUsers
                .filter((u) => !selectedMembers.some((sm) => sm._id === u._id))
                .filter(
                  (u) =>
                    u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(memberSearch.toLowerCase())
                )
                .map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => {
                      setSelectedMembers((prev) => [...prev, user]);
                      setMemberSearch("");
                    }}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "none",
                      borderBottom: "1px solid rgba(216,227,255,0.55)",
                      background: "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#0C1B3A",
                          marginBottom: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.name}
                      </p>
                      <p style={{ fontSize: 12, color: "#5B6B8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {user.email}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: "7px 12px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg, rgba(30,95,255,0.08), rgba(255,122,26,0.08))",
                        border: "1px solid rgba(30,95,255,0.12)",
                        color: "#1E5FFF",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      Add
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <div
            style={{
              padding: 18,
              borderRadius: 22,
              background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
              border: "1px solid rgba(216,227,255,0.9)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E5FFF", marginBottom: 4 }}>
              Team role
            </p>
            <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55, marginBottom: 14 }}>
              Choose the default role for every selected member.
            </p>

            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-[#D8E3FF] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm appearance-none"
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Team Admin</option>
              </select>
              <Shield className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderRadius: 18,
              background: "rgba(30,95,255,0.06)",
              border: "1px solid rgba(30,95,255,0.1)",
              color: "#33527E",
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 800 }}>Tip:</span>
            Keep team groups focused. Clear ownership makes the workspace easier to scan.
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F8FBFF] font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || selectedMembers.length === 0}
              className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
              }}
            >
              {submitting && <Loader2 className="animate-spin h-4 w-4" />}
              Add Member{selectedMembers.length > 1 ? "s" : ""}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
};

// ── Confirm Modal ──────────────────────────────────────────────────────────────
const ConfirmActionModal = ({ title, description, confirmText, isDestructive, onClose, onConfirm, loading }) => (
  <ModalShell
    title={title}
    eyebrow={isDestructive ? "Danger zone" : "Team action"}
    description={description}
    icon={isDestructive ? <Trash2 className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
    onClose={onClose}
    maxWidth="460px"
    tone={isDestructive ? "danger" : "brand"}
    contentPadding="24px"
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          padding: 16,
          borderRadius: 22,
          background: isDestructive ? "rgba(220,38,38,0.06)" : "rgba(30,95,255,0.06)",
          border: isDestructive ? "1px solid rgba(220,38,38,0.1)" : "1px solid rgba(30,95,255,0.1)",
          color: isDestructive ? "#7F1D1D" : "#33527E",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {isDestructive
          ? "This action removes the member from the team and can affect related assignments."
          : "This update changes how the team is managed without removing anyone from the workspace."}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:bg-[#F8FBFF] hover:text-text-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          style={{
            background: isDestructive
              ? "linear-gradient(135deg, #DC2626 0%, #F97316 100%)"
              : "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
          }}
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          {confirmText}
        </button>
      </div>
    </div>
  </ModalShell>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const TeamDetailPage = () => {
  const { id: projectId, teamId } = useParams();
  const navigate = useNavigate();
  const { isAdmin: isSystemAdmin, user: currentUser } = useAuth();

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionModal, setActionModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const [teamRes, membersRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}/teams/${teamId}`),
        api.get(`/projects/${projectId}/teams/${teamId}/members`),
        api.get(`/tasks?team=${teamId}`),
      ]);
      setTeam(teamRes.data.data);
      setMembers(membersRes.data.data);
      setTasks(tasksRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load team data");
      navigate(`/projects/${projectId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [projectId, teamId]);

  const adminCount = useMemo(
    () => members.filter((member) => member.role === "ADMIN").length,
    [members]
  );
  const activeTaskCount = useMemo(
    () => tasks.filter((task) => task.status !== "DONE").length,
    [tasks]
  );
  const completedTaskCount = useMemo(
    () => tasks.filter((task) => task.status === "DONE").length,
    [tasks]
  );

  const isTeamAdmin =
    members.find((member) => member._id === currentUser?._id)?.role === "ADMIN";
  const canManage = isSystemAdmin || isTeamAdmin;

  const projectIdValue = team?.project?._id || team?.project || projectId;
  const workspaceTitle = team?.project?.title || "Workspace";

  const handleActionConfirm = async () => {
    if (!actionModal) return;

    const { type, member } = actionModal;
    setActionLoading(true);
    try {
      if (type === "REMOVE") {
        await api.delete(`/projects/${projectId}/teams/${teamId}/members/${member._id}`);
        toast.success("Member removed");
      } else if (type === "ROLE") {
        const newRole = member.role === "ADMIN" ? "MEMBER" : "ADMIN";
        await api.patch(`/projects/${projectId}/teams/${teamId}/members/${member._id}/role`, {
          role: newRole,
        });
        toast.success("Role updated");
      }

      await fetchTeamData();
      setActionModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <ManagementPageShell
        eyebrow="Team detail"
        title="Loading team"
        description="We are gathering the members and task context for this workspace team."
        icon={<Users2 className="w-5 h-5" />}
      >
        <div className="section-state animate-scale-in">
          <div className="section-state__icon animate-spin-slow">
            <Loader2 className="w-7 h-7" />
          </div>
          <p className="section-state__title">Loading team</p>
          <p className="section-state__text">
            We are arranging the team details, members, and recent tasks.
          </p>
        </div>
      </ManagementPageShell>
    );
  }

  if (!team) return null;

  const breadcrumbs = (
    <>
      <Link to="/projects">Workspaces</Link>
      <span className="page-hero__breadcrumbs-separator">/</span>
      <Link to={`/projects/${projectIdValue}`}>{workspaceTitle}</Link>
      <span className="page-hero__breadcrumbs-separator">/</span>
      <span>{team.name}</span>
    </>
  );

  return (
    <ManagementPageShell
      eyebrow="Team detail"
      title={team.name}
      description={team.description || "Members, ownership, and related work in one organized place."}
      icon={<Users2 className="w-5 h-5" />}
      breadcrumbs={breadcrumbs}
      stats={[
        {
          label: "Members",
          value: members.length,
          hint: "in this team",
          accent: "#1E5FFF",
        },
        {
          label: "Admins",
          value: adminCount,
          hint: "team leads",
          accent: "#8B5CF6",
        },
        {
          label: "Active tasks",
          value: activeTaskCount,
          hint: "in progress",
          accent: "#FF7A1A",
        },
        {
          label: "Completed",
          value: completedTaskCount,
          hint: "finished work",
          accent: "#059669",
        },
      ]}
      action={
        canManage ? (
          <button
            onClick={() => setShowAddModal(true)}
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
            Add Member
          </button>
        ) : null
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_340px] gap-6">
        <div className="space-y-6">
          <DetailSectionCard
            title="Team members"
            description={`${members.length} member${members.length !== 1 ? "s" : ""} on this team`}
            icon={<Users2 className="w-5 h-5" />}
          >
            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
                  <Users2 className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-text-primary">No team members yet</p>
                <p className="text-xs text-text-secondary mt-1 max-w-xs">
                  Add workspace members to this team to start collaborating
                </p>
                {canManage ? (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add First Member
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-sm font-bold text-white uppercase shrink-0 shadow-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-primary truncate">
                            {member.name}
                          </p>
                          {member.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                              Member
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary truncate mt-0.5 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden sm:block text-right">
                        <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                          Joined
                        </p>
                        <p className="text-xs text-text-primary mt-0.5">
                          {formatDate(member.joinedAt)}
                        </p>
                      </div>

                      {canManage ? (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === member._id ? null : member._id
                              )
                            }
                            className="p-1.5 text-gray-400 hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openDropdownId === member._id ? (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                                <button
                                  onClick={() => {
                                    setActionModal({ type: "ROLE", member });
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Shield className="w-4 h-4 text-text-secondary" />
                                  Make {member.role === "ADMIN" ? "Member" : "Admin"}
                                </button>
                                <button
                                  onClick={() => {
                                    setActionModal({ type: "REMOVE", member });
                                    setOpenDropdownId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove from Team
                                </button>
                              </div>
                            </>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailSectionCard>
        </div>

        <div className="space-y-6">
          <DetailSectionCard
            title="Team overview"
            description="Workspace context, ownership, and key team facts."
            icon={<FolderKanban className="w-5 h-5" />}
          >
            <p className="text-sm text-text-secondary leading-relaxed pb-6 border-b border-gray-100">
              {team.description || "No description provided for this team."}
            </p>

            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <FolderKanban className="w-4.5 h-4.5 text-gray-400" />
                  Workspace
                </div>
                {team.project ? (
                  <Link
                    to={`/projects/${projectIdValue}`}
                    className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors text-right truncate max-w-[180px]"
                  >
                    {workspaceTitle}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-text-primary">Workspace</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <Users2 className="w-4.5 h-4.5 text-gray-400" />
                  Total Members
                </div>
                <span className="text-sm font-bold text-text-primary bg-gray-50 px-2.5 py-1 rounded-lg">
                  {members.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  Team Admins
                </div>
                <span className="text-sm font-bold text-text-primary bg-gray-50 px-2.5 py-1 rounded-lg">
                  {adminCount}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <CheckSquare className="w-4.5 h-4.5 text-blue-500" />
                  Active Tasks
                </div>
                <span className="text-sm font-bold text-text-primary bg-gray-50 px-2.5 py-1 rounded-lg">
                  {activeTaskCount}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <Calendar className="w-4.5 h-4.5 text-gray-400" />
                  Created On
                </div>
                <span className="text-sm font-semibold text-text-primary">
                  {formatDate(team.createdAt)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-sm font-medium text-text-secondary">
                  <Users2 className="w-4.5 h-4.5 text-gray-400" />
                  Team ID
                </div>
                <span className="text-xs font-mono text-text-secondary bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 truncate max-w-[180px]">
                  {team._id}
                </span>
              </div>
            </div>
          </DetailSectionCard>
        </div>
      </div>

      <div className="mt-6">
        <DetailSectionCard
          title="Team tasks"
          description={`${tasks.length} task${tasks.length !== 1 ? "s" : ""} · ${completedTaskCount} completed`}
          icon={<CheckSquare className="w-5 h-5" />}
          action={
            <Link
              to={`/tasks?team=${team._id}`}
              className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              View all →
            </Link>
          }
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
                <ListTodo className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-text-primary">No tasks yet</p>
              <p className="text-xs text-text-secondary mt-1 max-w-xs">
                Tasks assigned to this team will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tasks.slice(0, 5).map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors no-underline"
                >
                  <div className="flex items-center gap-4 min-w-0">
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
                      <p className="text-sm font-bold text-text-primary truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-2">
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">
                          {task.status.replace("_", " ")}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4 hidden sm:block">
                    <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                      Due
                    </p>
                    <p className="text-xs text-text-primary mt-0.5">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </DetailSectionCard>
      </div>

      {showAddModal ? (
        <AddMemberModal
          projectId={projectId}
          teamId={teamId}
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
            fetchTeamData();
          }}
        />
      ) : null}

      {actionModal ? (
        <ConfirmActionModal
          title={actionModal.type === "REMOVE" ? "Remove Member" : "Change Role"}
          description={
            actionModal.type === "REMOVE"
              ? `Are you sure you want to remove ${actionModal.member.name} from this team?`
              : `Change ${actionModal.member.name}'s role to ${
                  actionModal.member.role === "ADMIN" ? "Member" : "Admin"
                }?`
          }
          confirmText={actionModal.type === "REMOVE" ? "Remove" : "Confirm"}
          isDestructive={actionModal.type === "REMOVE"}
          loading={actionLoading}
          onClose={() => setActionModal(null)}
          onConfirm={handleActionConfirm}
        />
      ) : null}
    </ManagementPageShell>
  );
};

export default TeamDetailPage;
