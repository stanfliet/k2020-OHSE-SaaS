import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [pendingDocuments, setPendingDocuments] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [projectsRes, complianceRes, docsRes] = await Promise.all([
        axios.get("/api/projects", { headers }),
        axios.get("/api/compliance/dashboard", { headers }).catch(() => ({ data: { data: [] } })),
        axios.get("/api/documents", { headers }).catch(() => ({ data: { data: [] } })),
      ]);

      setProjects(projectsRes.data.data || []);
      setPendingDocuments(
        docsRes.data.data?.filter((d: any) => d.approval_status === "draft").length || 0
      );

      // Calculate average compliance score
      const scores = complianceRes.data.data?.map((c: any) => c.compliance_score || 0) || [];
      const avgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a: number, b: number) => a + b) / scores.length)
          : 0;
      setComplianceScore(avgScore);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back to K2020-OHSE-SaaS</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-blue-100 mb-1">Active Projects</div>
            <div className="text-3xl font-bold">{projects.length}</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-green-100 mb-1">Compliance Score</div>
            <div className="text-3xl font-bold">{complianceScore}%</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-orange-100 mb-1">Pending Documents</div>
            <div className="text-3xl font-bold">{pendingDocuments}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white shadow-lg">
            <div className="text-sm font-semibold text-purple-100 mb-1">Action Items</div>
            <div className="text-3xl font-bold">8</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/projects/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            + New Project
          </button>
          <button
            onClick={() => navigate("/safety")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Generate Safety File
          </button>
          <button
            onClick={() => navigate("/documents")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            View Documents
          </button>
        </div>

        {/* Recent Projects */}
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Project Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-200">Start Date</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id} className="hover:bg-slate-700 transition duration-150">
                    <td className="px-6 py-4 text-sm text-white font-medium">{project.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{project.client || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === "active"
                          ? "bg-green-900 text-green-200"
                          : "bg-slate-600 text-slate-200"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(project.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-blue-400 hover:text-blue-300 font-semibold"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
