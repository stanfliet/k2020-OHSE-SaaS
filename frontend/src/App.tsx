import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DocumentModal } from "./components/DocumentModal";
import { ToastProvider, useToast } from "./components/Toast";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { CompliancePage } from "./pages/CompliancePage";
import { getCurrentUser, signOut } from "./lib/supabase";
import { uploadAndAnalyzeDocuments, generateDocuments, checkAPIHealth } from "./lib/api";
import "./App.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [extractedAnalysis, setExtractedAnalysis] = useState<any>(null);
  const [generatedDocs, setGeneratedDocs] = useState<any>(null);
  const { showToast } = useToast();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    // Check API health
    const checkHealth = async () => {
      const healthy = await checkAPIHealth();
      setApiHealthy(healthy);
      if (!healthy) {
        showToast("Backend API is not responding", "warning");
      }
    };
    checkHealth();
  }, [showToast]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const checkAuth = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
      showToast("Login successful!", "success");
    };
    checkAuth();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setActiveTab("dashboard");
      showToast("Logged out successfully", "info");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Logout failed", "error");
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setIsLoading(true);
    try {
      const result = await uploadAndAnalyzeDocuments(files);
      setExtractedAnalysis(result.analysis);
      showToast(`Successfully analyzed ${files.length} document(s)`, "success");
      setActiveTab("analysis");
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to analyze documents. Ensure backend is running.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDocuments = async () => {
    if (!extractedAnalysis) {
      showToast("Please upload and analyze documents first", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const projectData = {
        name: "Sample Project",
        location: "Sample Location",
        description: "Sample Description",
      };

      const result = await generateDocuments(projectData, extractedAnalysis);
      setGeneratedDocs(result.documents);
      showToast("Documents generated successfully!", "success");
      setActiveTab("generator");
    } catch (error) {
      console.error("Generation error:", error);
      showToast("Failed to generate documents. Ensure backend is running.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <LoginPage onSuccess={handleLogin} />;
  }

  return (
    <div className="app">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userEmail={currentUser?.email}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {!apiHealthy && (
          <div className="alert alert-danger" style={{ margin: "0" }}>
            ⚠️ Backend API is not responding. Some features may not work.
          </div>
        )}

        {activeTab === "dashboard" && <DashboardPage userEmail={currentUser?.email} />}

        {activeTab === "projects" && <ProjectsPage />}

        {activeTab === "compliance" && <CompliancePage />}

        {activeTab === "documents" && (
          <div className="page-container">
            <h1>Document Upload & Analysis</h1>
            <button
              className="btn btn-primary"
              onClick={() => setIsDocModalOpen(true)}
              disabled={isLoading}
            >
              📄 Upload Documents
            </button>

            {extractedAnalysis && (
              <div className="analysis-result">
                <h2>Extracted Analysis</h2>
                <div className="code-block">
                  <pre>{JSON.stringify(extractedAnalysis, null, 2)}</pre>
                </div>
              </div>
            )}

            <DocumentModal
              isOpen={isDocModalOpen}
              onClose={() => setIsDocModalOpen(false)}
              onUpload={handleFileUpload}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="page-container">
            <h1>AI Analysis Center</h1>
            <p>Advanced AI-powered document analysis and extraction</p>

            {extractedAnalysis && (
              <div className="analysis-result">
                <h2>Current Analysis</h2>
                <div className="code-block">
                  <pre>{JSON.stringify(extractedAnalysis, null, 2)}</pre>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleGenerateDocuments}
                  disabled={isLoading}
                  style={{ marginTop: "1rem" }}
                >
                  ✨ Generate OHSE Documents
                </button>
              </div>
            )}

            {!extractedAnalysis && (
              <p className="info-text">Upload documents from the Documents tab to analyze them.</p>
            )}
          </div>
        )}

        {activeTab === "generator" && (
          <div className="page-container">
            <h1>OHSE Document Generator</h1>
            <button
              className="btn btn-secondary"
              onClick={handleGenerateDocuments}
              disabled={isLoading || !extractedAnalysis}
            >
              ✨ Generate Documents
            </button>

            {generatedDocs && (
              <div className="generated-docs">
                <h2>Generated Documents</h2>
                {Object.entries(generatedDocs).map(([key, content]) => (
                  <details key={key} className="doc-item">
                    <summary>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</summary>
                    <div className="doc-content">
                      <pre>{String(content)}</pre>
                    </div>
                  </details>
                ))}
              </div>
            )}

            {!generatedDocs && (
              <p className="info-text">Analyze documents first to generate OHSE compliance documents.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}