import React, { useState, useEffect } from "react";
import axios from "axios";

const Quality: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [qualityPlans, setQualityPlans] = useState<any[]>([]);
  const [ncrs, setNcrs] = useState<any[]>([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [showNCRForm, setShowNCRForm] = useState(false);
  const [planFormData, setPlanFormData] = useState({ title: "", content: "" });
  const [ncrFormData, setNcrFormData] = useState({
    issue_description: "",
    severity: "minor",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      fetchQualityData();
    }
  }, [selectedProject]);

  const fetchQualityData = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const [plansRes, ncrsRes] = await Promise.all([
        axios.get(`/api/quality/project/${selectedProject}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`/api/quality/${selectedProject}/non-conformances`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setQualityPlans(plansRes.data.data || []);
      setNcrs(ncrsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quality data:", error);
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/quality",
        { project_id: selectedProject, ...planFormData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQualityPlans([data.data, ...qualityPlans]);
      setPlanFormData({ title: "", content: "" });
      setShowPlanForm(false);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleCreateNCR = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `/api/quality/${selectedProject}/non-conformances`,
        ncrFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNcrs([data.data, ...ncrs]);
      setNcrFormData({ issue_description: "", severity: "minor" });
      setShowNCRForm(false);
    } catch (error) {
      console.error("Error creating NCR:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quality Management</h1>
          <p className="text-slate-400">Manage quality plans and non-conformances</p>
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
            {/* Quality Plans Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Quality Plans</h2>
                <button
                  onClick={() => setShowPlanForm(!showPlanForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  + New Plan
                </button>
              </div>

              {showPlanForm && (
                <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
                  <div className="space-y-4 mb-4">
                    <input
                      type="text"
                      placeholder="Plan Title"
                      value={planFormData.title}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, title: e.target.value })
                      }
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                    />
                    <textarea
                      rows={6}
                      placeholder="Plan Content..."
                      value={planFormData.content}
                      onChange={(e) =>
                        setPlanFormData({ ...planFormData, content: e.target.value })
                      }
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleCreatePlan}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      Save Plan
                    </button>
                    <button
                      onClick={() => setShowPlanForm(false)}
                      className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-slate-400">Loading...</div>
              ) : qualityPlans.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-6 text-slate-400">
                  No quality plans created yet
                </div>
              ) : (
                <div className="space-y-4">
                  {qualityPlans.map((plan) => (
                    <div key={plan.id} className="bg-slate-800 rounded-lg p-6 shadow-lg">
                      <h3 className="text-lg font-bold text-white mb-2">{plan.title}</h3>
                      <p className="text-slate-300 line-clamp-2 mb-2">{plan.content}</p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          plan.approval_status === "approved"
                            ? "bg-green-900 text-green-200"
                            : plan.approval_status === "review"
                            ? "bg-yellow-900 text-yellow-200"
                            : "bg-slate-600 text-slate-200"
                        }`}
                      >
                        {plan.approval_status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* NCR Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Non-Conformances (NCRs)
                </h2>
                <button
                  onClick={() => setShowNCRForm(!showNCRForm)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  + New NCR
                </button>
              </div>

              {showNCRForm && (
                <div className="bg-slate-800 rounded-lg p-6 mb-6 shadow-lg">
                  <div className="space-y-4 mb-4">
                    <textarea
                      rows={4}
                      placeholder="Issue Description"
                      value={ncrFormData.issue_description}
                      onChange={(e) =>
                        setNcrFormData({
                          ...ncrFormData,
                          issue_description: e.target.value,
                        })
                      }
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                    />
                    <select
                      value={ncrFormData.severity}
                      onChange={(e) =>
                        setNcrFormData({ ...ncrFormData, severity: e.target.value })
                      }
                      className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg"
                    >
                      <option value="minor">Minor</option>
                      <option value="major">Major</option>
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleCreateNCR}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      Create NCR
                    </button>
                    <button
                      onClick={() => setShowNCRForm(false)}
                      className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {ncrs.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-6 text-slate-400">
                  No non-conformances recorded
                </div>
              ) : (
                <div className="space-y-4">
                  {ncrs.map((ncr) => (
                    <div
                      key={ncr.id}
                      className={`rounded-lg p-6 shadow-lg ${
                        ncr.severity === "major"
                          ? "bg-red-900"
                          : "bg-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {ncr.issue_description}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ncr.severity === "major"
                              ? "bg-red-700 text-red-100"
                              : "bg-yellow-700 text-yellow-100"
                          }`}
                        >
                          {ncr.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        Raised: {new Date(ncr.raised_date).toLocaleDateString()}
                      </p>
                      <p className="text-slate-400 text-sm">
                        Status: {ncr.status}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quality;
