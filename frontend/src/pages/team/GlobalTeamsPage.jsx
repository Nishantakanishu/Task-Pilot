import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import {
  Loader2,
  Search,
  Users2,
  FolderKanban,
} from "lucide-react";
import TeamCard from "../../components/team/TeamCard";

const GlobalTeamsPage = () => {
  const { isAdmin } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/teams");
      setTeams(data.data);
    } catch {
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = useMemo(() => {
    if (!searchQuery.trim()) return teams;
    const q = searchQuery.toLowerCase();
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.project?.title && t.project.title.toLowerCase().includes(q))
    );
  }, [teams, searchQuery]);

  const workspaceCount = useMemo(() => {
    const ids = new Set(
      teams.map((team) => team.project?._id || team.project).filter(Boolean)
    );
    return ids.size;
  }, [teams]);

  const pageStats = useMemo(
    () => [
      {
        label: "Total teams",
        value: teams.length,
        hint: isAdmin ? "managed" : "assigned",
        accent: "#1E5FFF",
      },
      {
        label: "Visible now",
        value: filteredTeams.length,
        hint: searchQuery.trim() ? "matching search" : "on screen",
        accent: "#8B5CF6",
      },
      {
        label: "Workspaces",
        value: workspaceCount,
        hint: "represented",
        accent: "#FF7A1A",
      },
    ],
    [teams.length, filteredTeams.length, searchQuery, workspaceCount, isAdmin]
  );

  const toolbar = (
    <div className="toolbar-row toolbar-row--between">
      <div className="toolbar-control toolbar-control--search">
        <Search className="toolbar-control__icon h-4 w-4" />
        <input
          type="text"
          placeholder="Search teams or workspaces..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="toolbar-control__input"
        />
      </div>
      <p className="toolbar-meta">
        {loading
          ? "Loading teams..."
          : `${filteredTeams.length} team${filteredTeams.length === 1 ? "" : "s"} visible`}
      </p>
    </div>
  );

  return (
    <ManagementPageShell
      eyebrow="People and ownership"
      title="Teams"
      description={
        isAdmin
          ? "Manage every team across your workspaces from a single professional view."
          : "See the teams you belong to and jump into the right workspace quickly."
      }
      icon={<Users2 className="w-5 h-5" />}
      action={
        isAdmin ? (
          <Link
            to="/projects"
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <FolderKanban className="w-4 h-4" />
            Go to Workspaces
          </Link>
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
          <p className="section-state__title">Loading teams</p>
          <p className="section-state__text">
            We are gathering your workspace teams and arranging them for review.
          </p>
        </div>
      ) : teams.length === 0 ? (
        <div className="section-state animate-scale-in">
          <div className="section-state__icon">
            <Users2 className="w-9 h-9" />
          </div>
          <p className="section-state__title">No teams yet</p>
          <p className="section-state__text">
            {isAdmin
              ? "Create teams inside workspaces to get started."
              : "You have not been added to any team yet."}
          </p>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="section-state animate-scale-in">
          <div className="section-state__icon">
            <Search className="w-9 h-9" />
          </div>
          <p className="section-state__title">No matching teams</p>
          <p className="section-state__text">
            Try adjusting your search query to surface a team.
          </p>
        </div>
      ) : (
        <div className="responsive-card-grid animate-fade-in-up">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team._id}
              team={team}
              isAdmin={isAdmin}
              showWorkspaceInfo={true}
            />
          ))}
        </div>
      )}
    </ManagementPageShell>
  );
};

export default GlobalTeamsPage;
