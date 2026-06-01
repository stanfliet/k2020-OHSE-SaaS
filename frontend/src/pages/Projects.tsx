import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProject = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post("/api/projects", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, data.data]);
      setFormData({});
      setShowForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
            <p className="text-slate-400">Manage all your construction projects</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            + New Project
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <input
                type="text"
                placeholder="Project Name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Client Name"
                name="client"
                value={formData.client || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Site Address"
                name="site_address"
                value={formData.site_address || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="number"
                placeholder="Contract Value"
                name="contract_value"
                value={formData.contract_value || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="date"
                placeholder="Start Date"
                name="start_date"
                value={formData.start_date || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="date"
                placeholder="End Date"
                name="end_date"
                value={formData.end_date || ""}
                onChange={handleInputChange}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
            </div>
            <textarea
              placeholder="Project Scope"
              name="scope"
              value={formData.scope || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={handleCreateProject}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Create Project
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-200 cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{project.client || "No client specified"}</p>
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="text-slate-400">Location:</span> {project.site_address || "N/A"}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                      project.status === "active"
                        ? "bg-green-900 text-green-200"
                        : "bg-slate-600 text-slate-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Value:</span> R
                  {project.contract_value?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
