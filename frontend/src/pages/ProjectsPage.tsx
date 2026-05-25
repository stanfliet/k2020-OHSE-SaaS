import React, { useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import "../styles/Projects.css";

interface Project {
  id: string;
  name: string;
  description?: string;
  location?: string;
  status?: string;
  createdAt?: string;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Construction Site A",
      description: "High-rise residential building project",
      location: "Downtown District",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Industrial Facility B",
      description: "Manufacturing plant safety compliance",
      location: "Industrial Zone",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newProject: Project = {
      id: Math.random().toString(),
      ...formData,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    setProjects([...projects, newProject]);
    setFormData({ name: "", description: "", location: "" });
    setIsCreating(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "➕ New Project"}
        </button>
      </div>

      {isCreating && (
        <div className="create-project-form">
          <h2>Create New Project</h2>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label htmlFor="name">Project Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter project description"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Enter project location"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Project
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects yet. Create one to get started!</p>
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              onDelete={handleDeleteProject}
            />
          ))
        )}
      </div>
    </div>
  );
}
