import React, { useState, useEffect } from "react";
import axios from "axios";

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    incident_date: new Date().toISOString().split("T")[0],
    description: "",
    severity: "medium",
    injuries: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedProject) {
      fetchIncidents();
    }
  }, [selectedProject]);

  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `/api/incidents/project/${selectedProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIncidents(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setLoading(false);
    }
  };

  const handleReportIncident = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/incidents",
        { project_id: selectedProject, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIncidents([data.data, ...incidents]);
      setFormData({
        incident_date: new Date().toISOString().split("T")[0],
        description: "",
        severity: "medium",
        injuries: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error reporting incident:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900 text-red-200";
      case "high":
        return "bg-orange-900 text-orange-200";
      case "medium":
        return "bg-yellow-900 text-yellow-200";
      case "low":
        return "bg-blue-900 text-blue-200";
      default:
        return "bg-slate-600 text-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Incident Management</h1>
            <p className="text-slate-400">Track and manage site incidents</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            + Report Incident
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Report New Incident</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Incident Date
                </label>
                <input
                  type="date"
                  value={formData.incident_date}
                  onChange={(e) =>
                    setFormData({ ...formData, incident_date: e.target.value })
                  }
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value })
                  }
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Description *
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what happened..."
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Injuries
                </label>
                <input
                  type="text"
                  value={formData.injuries}
                  onChange={(e) =>
                    setFormData({ ...formData, injuries: e.target.value })
                  }
                  placeholder="Description of injuries (if any)"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleReportIncident}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Submit Report
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

        <div className="mb-6">
          <label className="text-slate-300 text-sm font-semibold block mb-2">
            Select Project
          </label>
          <input
            type="text"
            placeholder="Enter project ID"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
          />
        </div>

        {loading ? (
          <div className="text-slate-400 text-center">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-400">No incidents reported yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-slate-800 rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {incident.description}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {new Date(incident.incident_date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                </div>
                {incident.root_cause && (
                  <div className="mb-4">
                    <p className="text-slate-400 text-sm font-semibold">Root Cause:</p>
                    <p className="text-slate-300">{incident.root_cause}</p>
                  </div>
                )}
                {incident.corrective_actions && (
                  <div className="mb-4">
                    <p className="text-slate-400 text-sm font-semibold">Corrective Actions:</p>
                    <p className="text-slate-300">{incident.corrective_actions}</p>
                  </div>
                )}
                <p className="text-slate-400 text-sm">
                  Status: <span className="text-white font-semibold">{incident.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;
