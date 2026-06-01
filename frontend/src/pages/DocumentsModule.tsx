import React, { useState, useEffect } from "react";
import { Download, FileText, Eye, Lock, CheckCircle, Clock, X } from "lucide-react";

interface Document {
  id: string;
  title: string;
  content: string;
  type: string;
  approval_status: "draft" | "review" | "approved" | "archived";
  created_by: string;
  created_at: string;
  updated_at: string;
}

const DocumentsModule: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx">("pdf");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "review" | "approved">("all");

  // Sample documents (in real app, would fetch from API)
  useEffect(() => {
    const sampleDocs: Document[] = [
      {
        id: "1",
        title: "Site Specific H&S Plan - Project Alpha",
        content: "This is a comprehensive health and safety plan for the construction site...",
        type: "safety_plan",
        approval_status: "draft",
        created_by: "user123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Method Statement - Excavation Works",
        content: "Detailed method statement for excavation activities including equipment, safety measures...",
        type: "method_statement",
        approval_status: "review",
        created_by: "user123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Risk Assessment - Working at Heights",
        content: "Comprehensive risk assessment identifying hazards and control measures for heights work...",
        type: "risk_assessment",
        approval_status: "approved",
        created_by: "user123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    setDocuments(sampleDocs);
  }, []);

  const filteredDocs = filterStatus === "all" 
    ? documents 
    : documents.filter(doc => doc.approval_status === filterStatus);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300", icon: Clock, label: "Draft" },
      review: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", icon: Eye, label: "In Review" },
      approved: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-400", icon: CheckCircle, label: "Approved" },
      archived: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", icon: Lock, label: "Archived" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const handleExport = async (doc: Document, format: "pdf" | "docx") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/documents/export/${format}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          content: doc.content,
          title: doc.title,
          author: "K2020-OHSE-SaaS",
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${doc.title}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export document");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (doc: Document) => {
    setDocuments(
      documents.map(d =>
        d.id === doc.id ? { ...d, approval_status: "approved" as const } : d
      )
    );
    setSelectedDoc(null);
  };

  const handleReject = (doc: Document) => {
    setDocuments(
      documents.map(d =>
        d.id === doc.id ? { ...d, approval_status: "draft" as const } : d
      )
    );
    setSelectedDoc(null);
  };

  const handleArchive = (doc: Document) => {
    setDocuments(
      documents.map(d =>
        d.id === doc.id ? { ...d, approval_status: "archived" as const } : d
      )
    );
    setSelectedDoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Document Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Generate, preview, export, and approve project documents
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "draft", "review", "approved"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              filterStatus === status
                ? "bg-blue-600 dark:bg-blue-700 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
            onClick={() => setSelectedDoc(doc)}
          >
            <div className="p-6 space-y-4">
              {/* Type Badge */}
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                  {doc.type.replace(/_/g, " ")}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
                {doc.title}
              </h3>

              {/* Content Preview */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {doc.content}
              </p>

              {/* Status */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                {getStatusBadge(doc.approval_status)}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No documents found in {filterStatus} status
          </p>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedDoc.title}
              </h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status & Metadata */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {getStatusBadge(selectedDoc.approval_status)}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Created: {new Date(selectedDoc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Document Content */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedDoc.content}
                </p>
              </div>

              {/* Export Options */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-900 dark:text-white">Export</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(selectedDoc, "pdf")}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport(selectedDoc, "docx")}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    DOCX
                  </button>
                </div>
              </div>

              {/* Approval Actions */}
              {selectedDoc.approval_status === "draft" && (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">Actions</p>
                  <button
                    onClick={() => handleApprove(selectedDoc)}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Ready for Review
                  </button>
                </div>
              )}

              {selectedDoc.approval_status === "review" && (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">Review Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleApprove(selectedDoc)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedDoc)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {selectedDoc.approval_status === "approved" && (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 dark:text-white">Manage</p>
                  <button
                    onClick={() => handleArchive(selectedDoc)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Archive
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsModule;
