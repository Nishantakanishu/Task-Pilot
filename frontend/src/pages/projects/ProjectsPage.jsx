import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import ProjectCard from "../../components/projects/ProjectCard";
import CreateProjectForm from "../../components/forms/CreateProjectForm";
import ManagementPageShell from "../../components/layout/ManagementPageShell";
import ModalShell from "../../components/layout/ModalShell";
import { useAuth } from "../../context/AuthContext";
import {
  Plus,
  FolderClosed,
  Search,
  Loader2,
  FolderKanban,
} from "lucide-react";

const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/projects");
      setProjects(data.data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setShowForm(false);
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  const totalMembers = useMemo(
    () =>
      projects.reduce(
        (count, project) => count + (project.members?.length || 0),
        0
      ),
    [projects]
  );

  const workspaceStats = useMemo(
    () => [
      {
        label: "Total workspaces",
        value: projects.length,
        hint: isAdmin ? "managed" : "assigned",
        accent: "#1E5FFF",
      },
      {
        label: "Visible now",
        value: filteredProjects.length,
        hint: searchQuery.trim() ? "matching search" : "on screen",
        accent: "#FF7A1A",
      },
      {
        label: "Collaborators",
        value: totalMembers,
        hint: "workspace access",
        accent: "#059669",
      },
    ],
    [projects.length, filteredProjects.length, searchQuery, totalMembers, isAdmin]
  );

  const toolbar = (
    <div className="toolbar-row toolbar-row--between">
      <div className="toolbar-control toolbar-control--search">
        <Search className="toolbar-control__icon h-4 w-4" />
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="toolbar-control__input"
        />
      </div>
      <p className="toolbar-meta">
        {loading
          ? "Loading workspaces..."
          : `${filteredProjects.length} workspace${
              filteredProjects.length === 1 ? "" : "s"
            } visible`}
      </p>
    </div>
  );

  return (
    <>
      <ManagementPageShell
        eyebrow="Workspace library"
        title="Workspaces"
        description={
          isAdmin
            ? "Manage all project workspaces from one clear, organized view."
            : "Review the workspaces assigned to you and open any project in one step."
        }
        icon={<FolderKanban className="w-5 h-5" />}
        action={
          isAdmin ? (
            <button
              id="new-project-btn"
              onClick={() => setShowForm(true)}
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
              New Workspace
            </button>
          ) : null
        }
        stats={workspaceStats}
        toolbar={toolbar}
      >
        {loading ? (
          <div className="section-state animate-scale-in">
            <div className="section-state__icon animate-spin-slow">
              <Loader2 className="w-7 h-7" />
            </div>
            <p className="section-state__title">Loading workspaces</p>
            <p className="section-state__text">
              We are pulling in the latest project data and preparing your view.
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="section-state animate-scale-in">
            <div className="section-state__icon">
              <FolderClosed className="w-9 h-9" />
            </div>
            <p className="section-state__title">No workspaces yet</p>
            <p className="section-state__text">
              {isAdmin
                ? "Create your first workspace to start organizing tasks."
                : "You have not been assigned to any workspaces yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
                style={{
                  marginTop: "24px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Plus className="w-4 h-4" />
                Create Workspace
              </button>
            )}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="section-state animate-scale-in">
            <div className="section-state__icon">
              <Search className="w-9 h-9" />
            </div>
            <p className="section-state__title">No matching workspaces</p>
            <p className="section-state__text">
              Try adjusting your search query to surface a workspace.
            </p>
          </div>
        ) : (
          <div className="responsive-card-grid animate-fade-in-up">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </ManagementPageShell>

      {showForm && (
        <ModalShell
          title="Create Workspace"
          eyebrow="New workspace"
          description="Set up a clean project space so the team has one organized place to work."
          icon={<FolderKanban className="w-5 h-5" />}
          onClose={() => setShowForm(false)}
          maxWidth="560px"
        >
          <CreateProjectForm
            onSuccess={handleProjectCreated}
            onCancel={() => setShowForm(false)}
          />
        </ModalShell>
      )}
    </>
  );
};

export default ProjectsPage;
