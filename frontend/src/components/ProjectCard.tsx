import React from "react";
import "../styles/ProjectCard.css";

interface ProjectCardProps {
  id: string;
  name: string;
  description?: string;
  status?: string;
  location?: string;
  createdAt?: string;
  onSelect?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  id,
  name,
  description,
  status = "active",
  location,
  createdAt,
  onSelect,
  onDelete,
}: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      active: "success",
      completed: "info",
      on_hold: "warning",
      archived: "danger",
    };
    return statusMap[status] || "primary";
  };

  return (
    <div className="project-card" onClick={() => onSelect?.(id)}>
      <div className="card-header">
        <h3>{name}</h3>
        <div className="card-actions">
          {onDelete && (
            <button
              className="btn-icon btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              title="Delete project"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {description && <p className="card-description">{description}</p>}

      <div className="card-info">
        {location && (
          <div className="info-item">
            <span className="info-label">📍 Location:</span>
            <span className="info-value">{location}</span>
          </div>
        )}

        {status && (
          <div className="info-item">
            <span className={`badge badge-${getStatusBadge(status)}`}>{status}</span>
          </div>
        )}
      </div>

      {createdAt && (
        <div className="card-footer">
          <small>Created: {new Date(createdAt).toLocaleDateString()}</small>
        </div>
      )}
    </div>
  );
}
