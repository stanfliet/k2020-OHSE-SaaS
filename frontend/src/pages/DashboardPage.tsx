import React, { useState, useEffect } from "react";
import { getProjects } from "../lib/api";
import "../styles/Dashboard.css";

interface DashboardPageProps {
  user?: any;
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

export function DashboardPage({ user, onShowToast }: DashboardPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalDocuments: 0,
    totalAnalyses: 0,
    generatedDocs: 0
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
      
      const activeCount = fetchedProjects.filter(p => p.status === "active").length;
      setStats({
        activeProjects: activeCount,
        totalDocuments: fetchedProjects.length * 2,
        totalAnalyses: fetchedProjects.length,
        generatedDocs: fetchedProjects.length
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      onShowToast?.("Failed to load dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const userDisplayName = user?.user_metadata?.first_name || user?.email || "User";
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome back, {userDisplayName}!</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Active Projects" value={stats.activeProjects} icon="📁" color="blue" />
        <StatCard label="Documents Uploaded" value={stats.totalDocuments} icon="📄" color="green" />
        <StatCard label="AI Analyses" value={stats.totalAnalyses} icon="🤖" color="purple" />
        <StatCard label="Generated Docs" value={stats.generatedDocs} icon="✨" color="orange" />
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <p className="empty-state">No recent activity</p>
          </div>
        </div>

        <div className="content-section">
          <h2>Quick Start</h2>
          <div className="quick-actions">
            <div className="action-card">
              <div className="action-icon">📁</div>
              <h3>Create Project</h3>
              <p>Start a new OHSE compliance project</p>
            </div>
            <div className="action-card">
              <div className="action-icon">📄</div>
              <h3>Upload Documents</h3>
              <p>Analyze construction documents with AI</p>
            </div>
            <div className="action-card">
              <div className="action-icon">✨</div>
              <h3>Generate Documents</h3>
              <p>Create OHSE compliance documents</p>
            </div>
            <div className="action-card">
              <div className="action-icon">✓</div>
              <h3>Track Compliance</h3>
              <p>Monitor compliance status and audits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
