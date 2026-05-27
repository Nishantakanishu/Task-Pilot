import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight, Calendar, Users2 } from "lucide-react";

const ProjectCard = ({ project }) => {
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="entity-card card-hover group">
      <div className="entity-card__glow" />

      <div className="entity-card__top">
        <div
          className="entity-card__icon"
          style={{
            background: "linear-gradient(135deg, rgba(30,95,255,0.12), rgba(255,122,26,0.12))",
            border: "1px solid rgba(184,204,255,0.55)",
          }}
        >
          <FolderKanban className="w-5 h-5 text-primary" />
        </div>

        <div className="entity-card__heading">
          <div className="entity-card__title-row">
            <h3 className="entity-card__title truncate group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <span className="entity-card__badge">Workspace</span>
          </div>

          <p className="entity-card__description line-clamp-3">
            {project.description || "No description provided for this workspace."}
          </p>
        </div>
      </div>

      <div className="entity-card__meta">
        <span className="entity-card__chip">
          <Users2 className="w-3.5 h-3.5" />
          {project.members?.length || 0} members
        </span>
        {project.createdBy?.name ? (
          <span className="entity-card__chip">Created by {project.createdBy.name}</span>
        ) : null}
      </div>

      <div className="entity-card__footer">
        <div className="entity-card__footer-meta">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <Link
          to={`/projects/${project._id}`}
          className="entity-card__cta group/link"
          style={{ textDecoration: "none" }}
        >
          Open
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
