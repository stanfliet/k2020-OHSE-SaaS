import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DocumentModal } from "./components/DocumentModal";
import { ToastProvider, useToast } from "./components/Toast";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { CompliancePage } from "./pages/CompliancePage";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import {
  uploadAndAnalyzeDocuments,
  generateDocuments,
  checkAPIHealth,
} from "./lib/api";
import "./App.css";

function AppContent() {
  const { isLoggedIn, isLoading: authLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [extractedAnalysis, setExtractedAnalysis] = useState<any>(null);

  const { showToast } = useToast();

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkAPIHealth();
      setApiHealthy(healthy);
      if (!healthy) showToast("Backend API is not responding", "warning");
    };
    checkHealth();
  }, [showToast]);

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "spin 1s linear infinite",
            }}
          >
            ⚙️
          </div>
          <h2>Loading K2020 OHSE...</h2>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onSuccess={() => window.location.reload()} />;
  }

  const handleFileUpload = async (files: File[]) => {
    setIsLoading(true);
    try {
      const result = await uploadAndAnalyzeDocuments(files);
      setExtractedAnalysis(result.analysis);
      showToast(`Successfully analyzed ${files.length} document(s)`, "success");
      setActiveTab("analysis");
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Failed to analyze documents", "error");
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
      const result = await generateDocuments(extractedAnalysis, "health_safety");
      showToast("Documents generated successfully!", "success");
      setActiveTab("generator");
    } catch (error) {
      console.error("Generation error:", error);
      showToast("Failed to generate documents", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage user={user} onShowToast={showToast} />;
      case "projects":
        return <ProjectsPage />;
      case "compliance":
        return <CompliancePage />;
      case "documents":
        return (
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
        );
      case "analysis":
        return (
          <div className="page-container">
            <h1>AI Analysis Center</h1>
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
                  Generate Documents
                </button>
              </div>
            )}
          </div>
        );
      default:
        return <DashboardPage user={user} onShowToast={showToast} />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentPage={activeTab}
        onNavigate={setActiveTab}
        userEmail={user?.email}
      />
      <main className="main-content">
        {!apiHealthy && (
          <div className="alert alert-danger" style={{ margin: "0" }}>
            ⚠️ Backend API is not responding
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;