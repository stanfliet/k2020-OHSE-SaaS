import React, { useState } from "react";
import axios from "axios";

interface SafetyFileGeneratorProps {
  projectId: string;
}

const SafetyFileGenerator: React.FC<SafetyFileGeneratorProps> = ({ projectId }) => {
  const [documentType, setDocumentType] = useState("safety_plan");
  const [loading, setLoading] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<any>(null);

  const documentTypes = [
    { id: "safety_plan", label: "Site-Specific H&S Plan" },
    { id: "risk_assessment", label: "Risk Assessment" },
    { id: "method_statement", label: "Method Statements" },
    { id: "legal_appointment", label: "Legal Appointments" },
    { id: "incident_report", label: "Incident Report Template" },
  ];

  const handleGenerateDocument = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/safety/generate",
        {
          project_id: projectId,
          document_type: documentType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGeneratedDocument(data.document);
    } catch (error) {
      console.error("Error generating document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Safety File Generator</h2>

      <div className="mb-6">
        <label className="text-slate-300 text-sm font-semibold block mb-3">
          Document Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setDocumentType(type.id)}
              className={`p-4 rounded-lg font-semibold transition duration-200 ${
                documentType === type.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerateDocument}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
          loading
            ? "bg-slate-600 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Generating..." : "Generate Document"}
      </button>

      {generatedDocument && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">{generatedDocument.title}</h3>
          <div className="bg-slate-700 text-slate-200 p-6 rounded-lg max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap">{generatedDocument.content}</p>
          </div>

          <div className="flex gap-4 mt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg">
              Approve
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
              Export as PDF
            </button>
            <button className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg">
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyFileGenerator;
