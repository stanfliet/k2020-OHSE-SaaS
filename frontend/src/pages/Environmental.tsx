import React, { useState, useEffect } from "react";
import axios from "axios";

const Environmental: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    plan_type: "waste_management",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      fetchPlans();
    }
  }, [selectedProject]);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const { data } = await axios.get(
        `/api/environmental/project/${selectedProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching environmental plans:", error);
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/environmental",
        { project_id: selectedProject, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlans([data.data, ...plans]);
      setFormData({ plan_type: "waste_management", title: "", content: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const planTypes = [
    { id: "waste_management", label: "Waste Management Plan" },
    { id: "spill_response", label: "Spill Response Plan" },
    { id: "dust_control", label: "Dust Control Plan" },
    { id: "noise_control", label: "Noise Control Plan" },
    { id: "general", label: "General Environmental Plan" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Environmental Management</h1>
            <p className="text-slate-400">Create and manage environmental plans</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            + New Plan
          </button>
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

        {showForm && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Create Environmental Plan</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Plan Type
                </label>
                <select
                  value={formData.plan_type}
                  onChange={(e) =>
                    setFormData({ ...formData, plan_type: e.target.value })
                  }
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                >
                  {planTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Plan title"
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">
                  Content
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Detailed plan content..."
                  className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCreatePlan}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Create Plan
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

        {loading ? (
          <div className="text-slate-400 text-center">Loading...</div>
        ) : plans.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-400">No environmental plans created yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-slate-800 rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Type: {planTypes.find((t) => t.id === plan.plan_type)?.label}
                </p>
                <p className="text-slate-300 mb-4 line-clamp-3">{plan.content}</p>
                <button className="text-blue-400 hover:text-blue-300 font-semibold">
                  View Full Plan →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Environmental;
