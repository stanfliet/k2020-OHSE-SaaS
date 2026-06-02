import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ThemeProvider } from './lib/ThemeContext';
import { ToastProvider } from './components/Toast';
import { Sidebar } from './components/Sidebar';
import styles from './styles/Router.module.css';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CompliancePage } from './pages/CompliancePage';
import { GeneratorPage } from './pages/GeneratorPage';
import DocumentsModule from './pages/DocumentsModule';
import QsModule from './pages/QsModule';

// Layout component
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}>⚙️</div>
          <h2>Loading K2020 OHSE...</h2>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.layoutMain}>
        {children}
      </main>
    </div>
  );
}

// App Routes
function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onSuccess={() => window.location.reload()} />} 
      />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedLayout>
          <DashboardPage user={undefined} onShowToast={() => {}} />
        </ProtectedLayout>
      } />

      <Route path="/projects" element={
        <ProtectedLayout>
          <ProjectsPage onShowToast={() => {}} />
        </ProtectedLayout>
      } />

      <Route path="/compliance" element={
        <ProtectedLayout>
          <CompliancePage />
        </ProtectedLayout>
      } />

      <Route path="/documents" element={
        <ProtectedLayout>
          <DocumentsModule />
        </ProtectedLayout>
      } />

      <Route path="/analysis" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>🔍 AI Analysis Center</h1>
            <p>AI analysis and document review</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/generator" element={
        <ProtectedLayout>
          <GeneratorPage documents={null} isLoading={false} />
        </ProtectedLayout>
      } />

      <Route path="/safety-files" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>🛡️ Safety File Manager</h1>
            <p>Generate and manage safety files</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/training" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>📚 Training Management</h1>
            <p>Manage training records and certifications</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/incidents" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>⚠️ Incident Management</h1>
            <p>Report and track incidents</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/environmental" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>🌿 Environmental Management</h1>
            <p>Environmental plans and compliance</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/quality" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>✓ Quality Management</h1>
            <p>Quality plans, ITPs, and NCRs</p>
          </div>
        </ProtectedLayout>
      } />

      <Route path="/qs" element={
        <ProtectedLayout>
          <QsModule />
        </ProtectedLayout>
      } />

      <Route path="/company-profile" element={
        <ProtectedLayout>
          <div className="page-container">
            <h1>🏢 Company Profile</h1>
            <p>Manage company information</p>
          </div>
        </ProtectedLayout>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
