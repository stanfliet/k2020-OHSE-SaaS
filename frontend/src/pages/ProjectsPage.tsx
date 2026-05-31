import React, { useState, useEffect } from "react";
import { getProjects, createProject, deleteProject } from "../lib/api";
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

interface ProjectsPageProps {
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function ProjectsPage({ onShowToast }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const result = await getProjects();
      setProjects(result || []);
    } catch (error) {
      console.error("Failed to load projects:", error);
      onShowToast?.("Unable to load projects", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const newProject = await createProject({
        name: formData.name,
        description: formData.description,
        location: formData.location,
      });

      setProjects([newProject, ...projects]);
      setFormData({ name: "", description: "", location: "" });
      setIsCreating(false);
      onShowToast?.("Project created successfully", "success");
    } catch (error) {
      console.error("Create project failed:", error);
      onShowToast?.("Failed to create project", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteProject(id);
      setProjects(projects.filter((project) => project.id !== id));
      onShowToast?.("Project deleted", "success");
    } catch (error) {
      console.error("Delete project failed:", error);
      onShowToast?.("Failed to delete project", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p className="subtitle">Manage your OHSE construction projects</p>
        </div>
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
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Create Project"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreating(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {isLoading && projects.length === 0 ? (
          <div className="loading-state">Loading projects...</div>
        ) : projects.length === 0 ? (
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
