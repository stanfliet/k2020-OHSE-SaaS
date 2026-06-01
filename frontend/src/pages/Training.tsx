import React, { useState, useEffect } from "react";
import axios from "axios";

const Training: React.FC = () => {
  const [trainings, setTrainings] = useState<any[]>([]);
  const [expiringTrainings, setExpiringTrainings] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    course_name: "",
    provider: "",
    completion_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      fetchTrainingRecords();
    }
  }, [selectedProject]);

  const fetchTrainingRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const { data } = await axios.get(
        `/api/training/project/${selectedProject}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrainings(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching training records:", error);
      setLoading(false);
    }
  };

  const handleAddTraining = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/training",
        { project_id: selectedProject, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrainings([data.data, ...trainings]);
      setFormData({
        employee_id: "",
        course_name: "",
        provider: "",
        completion_date: new Date().toISOString().split("T")[0],
        expiry_date: "",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding training:", error);
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const days = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 && days <= 30;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Training Management</h1>
            <p className="text-slate-400">Track employee certifications and expiry dates</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            + Add Training Record
          </button>
        </div>

        {showForm && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add Training Record</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Employee ID"
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Course Name *"
                value={formData.course_name}
                onChange={(e) =>
                  setFormData({ ...formData, course_name: e.target.value })
                }
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Provider"
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="date"
                value={formData.completion_date}
                onChange={(e) =>
                  setFormData({ ...formData, completion_date: e.target.value })
                }
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiry_date}
                onChange={(e) =>
                  setFormData({ ...formData, expiry_date: e.target.value })
                }
                className="bg-slate-700 text-white px-4 py-2 rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleAddTraining}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Save Record
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
          <div className="text-slate-400 text-center">Loading...</div>
        ) : (
          <>
            {trainings.filter((t) => isExpiringSoon(t.expiry_date)).length > 0 && (
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
                <h3 className="text-yellow-200 font-semibold mb-2">⚠️ Expiring Soon</h3>
                <div className="space-y-1">
                  {trainings
                    .filter((t) => isExpiringSoon(t.expiry_date))
                    .map((t) => (
                      <p key={t.id} className="text-yellow-100 text-sm">
                        {t.course_name} - Expires {new Date(t.expiry_date).toLocaleDateString()}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {trainings.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-8 text-center">
                <p className="text-slate-400">No training records found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainings.map((training) => (
                  <div
                    key={training.id}
                    className={`rounded-lg p-6 shadow-lg ${
                      isExpired(training.expiry_date)
                        ? "bg-red-900"
                        : isExpiringSoon(training.expiry_date)
                        ? "bg-yellow-900"
                        : "bg-slate-800"
                    }`}
                  >
                    <h3 className="text-lg font-bold text-white mb-2">
                      {training.course_name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-1">
                      Provider: {training.provider || "N/A"}
                    </p>
                    <p className="text-slate-300 text-sm mb-1">
                      Completed: {new Date(training.completion_date).toLocaleDateString()}
                    </p>
                    {training.expiry_date && (
                      <p className="text-slate-300 text-sm">
                        Expires: {new Date(training.expiry_date).toLocaleDateString()}
                      </p>
                    )}
                    {isExpired(training.expiry_date) && (
                      <p className="text-red-200 text-xs font-semibold mt-2">EXPIRED</p>
                    )}
                    {isExpiringSoon(training.expiry_date) && (
                      <p className="text-yellow-200 text-xs font-semibold mt-2">EXPIRING SOON</p>
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

export default Training;
