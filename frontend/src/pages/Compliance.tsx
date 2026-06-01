import React, { useState, useEffect } from "react";
import axios from "axios";

const Compliance: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [complianceItems, setComplianceItems] = useState<any[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    requirement: "",
    due_date: "",
    assigned_to: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      fetchComplianceData();
    }
  }, [selectedProject]);

  const fetchComplianceData = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const { data } = await axios.get(
        `/api/compliance/project/${selectedProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplianceItems(data.data || []);
      setComplianceScore(data.complianceScore || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching compliance data:", error);
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/compliance",
        { project_id: selectedProject, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplianceItems([...complianceItems, data.data]);
      setFormData({ requirement: "", due_date: "", assigned_to: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding compliance item:", error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/compliance/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComplianceData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-900 text-green-200";
      case "in_progress":
        return "bg-blue-900 text-blue-200";
      case "not_started":
        return "bg-slate-600 text-slate-200";
      default:
        return "bg-slate-600 text-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Compliance Dashboard</h1>
          <p className="text-slate-400">Track compliance requirements and completion status</p>
        </div>

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

        {selectedProject && (
          <>
            {/* Compliance Score Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-8 mb-8 shadow-lg">
              <div className="text-center">
                <p className="text-green-100 text-lg font-semibold mb-2">Compliance Score</p>
                <div className="flex items-center justify-center">
                  <div className="text-6xl font-bold text-white">{complianceScore}%</div>
                  <div className="relative w-32 h-32 ml-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="white"
                        strokeWidth="8"
                        strokeDasharray={`${(complianceScore / 100) * 282.7} 282.7`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Item Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                + Add Compliance Item
              </button>
            </div>

            {showForm && (
              <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">New Compliance Item</h3>
                <div className="space-y-4 mb-4">
                  <input
                    type="text"
                    placeholder="Requirement Description"
                    value={formData.requirement}
                    onChange={(e) =>
                      setFormData({ ...formData, requirement: e.target.value })
                    }
                    className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) =>
                        setFormData({ ...formData, due_date: e.target.value })
                      }
                      className="bg-slate-700 text-white px-4 py-2 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Assigned To"
                      value={formData.assigned_to}
                      onChange={(e) =>
                        setFormData({ ...formData, assigned_to: e.target.value })
                      }
                      className="bg-slate-700 text-white px-4 py-2 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleAddItem}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Save
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

            {/* Compliance Items */}
            {loading ? (
              <div className="text-slate-400 text-center">Loading...</div>
            ) : complianceItems.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400">No compliance items added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complianceItems.map((item) => (
                  <div key={item.id} className="bg-slate-800 rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">
                          {item.requirement}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Due: {new Date(item.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateStatus(item.id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(item.status)}`}
                      >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    {item.assigned_to && (
                      <p className="text-slate-400 text-sm">
                        Assigned to: {item.assigned_to}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Compliance;
