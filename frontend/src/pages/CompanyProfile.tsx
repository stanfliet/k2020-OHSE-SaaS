import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [companies, setCompanies] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(data.data || []);
      if (data.data?.[0]) {
        setCompany(data.data[0]);
        setFormData(data.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (company?.id) {
        await axios.put(`/api/company/${company.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const { data } = await axios.post("/api/company", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(data.data);
      }
      setShowForm(false);
      fetchCompanies();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Company Profile</h1>
          <p className="text-slate-400">Manage your company information and details</p>
        </div>

        {companies.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <p className="text-slate-300 mb-4">No company profile found</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              + Create Company Profile
            </button>
          </div>
        ) : (
          <>
            {!showForm && company && (
              <div className="bg-slate-800 rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Company Name</label>
                    <p className="text-white text-lg mt-1">{company.name}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Registration Number</label>
                    <p className="text-white text-lg mt-1">{company.registration_number || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">VAT Number</label>
                    <p className="text-white text-lg mt-1">{company.vat_number || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Email</label>
                    <p className="text-white text-lg mt-1">{company.email || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Phone</label>
                    <p className="text-white text-lg mt-1">{company.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">City</label>
                    <p className="text-white text-lg mt-1">{company.city || "N/A"}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {showForm && (
              <div className="bg-slate-800 rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Company Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Registration Number</label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">VAT Number</label>
                    <input
                      type="text"
                      name="vat_number"
                      value={formData.vat_number || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-sm font-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      className="w-full mt-2 bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                  >
                    Save Changes
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
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
