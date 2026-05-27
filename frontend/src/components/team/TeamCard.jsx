import { Link } from "react-router-dom";
import { Users2, FolderKanban, Calendar, ArrowRight, Pencil, Trash2 } from "lucide-react";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TeamCard = ({ team, isAdmin, onEdit, onDelete, projectId, showWorkspaceInfo = false }) => {
  const finalProjectId = projectId || team.project?._id || team.project;

  return (
    <div className="entity-card card-hover group">
      <div className="entity-card__glow" />

      <div className="entity-card__top">
        <div
          className="entity-card__icon"
          style={{
            background: "linear-gradient(135deg, rgba(30,95,255,0.12), rgba(139,92,246,0.14))",
            border: "1px solid rgba(184,204,255,0.55)",
          }}
        >
          <Users2 className="w-5 h-5 text-primary" />
        </div>

        <div className="entity-card__heading">
          <div className="entity-card__title-row">
            <div className="min-w-0 flex-1">
              <h3 className="entity-card__title truncate group-hover:text-primary transition-colors">
                {team.name}
              </h3>
              {showWorkspaceInfo && team.project && (
                <div className="mt-1 flex items-center gap-1 text-xs text-text-secondary truncate">
                  <FolderKanban className="w-3 h-3 shrink-0" />
                  <span className="truncate">{team.project.title || "Workspace"}</span>
                </div>
              )}
              {!showWorkspaceInfo && team.createdBy && (
                <p className="mt-1 text-xs text-text-secondary">
                  Created by {team.createdBy.name}
                </p>
              )}
            </div>

            {isAdmin && (onEdit || onDelete) && (
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(team)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                    title="Edit team"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(team)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete team"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="entity-card__description line-clamp-3">
            {team.description || "No description provided for this team."}
          </p>
        </div>
      </div>

      <div className="entity-card__meta">
        <span className="entity-card__chip">
          <Users2 className="w-3.5 h-3.5" />
          {team.members?.length || 0} members
        </span>
        {team.project?.title && !showWorkspaceInfo ? (
          <span className="entity-card__chip">
            <FolderKanban className="w-3.5 h-3.5" />
            {team.project.title}
          </span>
        ) : null}
      </div>

      <div className="entity-card__footer">
        <div className="entity-card__footer-meta">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(team.createdAt)}</span>
        </div>

        <Link
          to={`/projects/${finalProjectId}/teams/${team._id}`}
          className="entity-card__cta"
          style={{ textDecoration: "none" }}
        >
          View
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default TeamCard;
