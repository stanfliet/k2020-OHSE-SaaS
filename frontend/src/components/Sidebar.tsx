import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { useTheme } from "../lib/ThemeContext";
import "../styles/Sidebar.css";

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  userEmail?: string;
  onLogout?: () => void;
}

export function Sidebar({ 
  currentPage, 
  onNavigate, 
  activeTab, 
  onTabChange, 
  userEmail, 
  onLogout 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const mainTabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "projects", label: "Projects", icon: "📁", path: "/projects" },
    { id: "documents", label: "Documents", icon: "📄", path: "/documents" },
    { id: "qs", label: "QS Module", icon: "💰", path: "/qs" },
    { id: "analysis", label: "AI Analysis", icon: "🤖", path: "/analysis" },
    { id: "generator", label: "Doc Generator", icon: "✨", path: "/generator" },
    { id: "compliance", label: "Compliance", icon: "✅", path: "/compliance" },
  ];

  const moduleTabs = [
    { id: "safety-files", label: "Safety Files", icon: "🛡️", path: "/safety-files" },
    { id: "training", label: "Training", icon: "📚", path: "/training" },
    { id: "incidents", label: "Incidents", icon: "⚠️", path: "/incidents" },
    { id: "environmental", label: "Environment", icon: "🌿", path: "/environmental" },
    { id: "quality", label: "Quality", icon: "✓", path: "/quality" },
    { id: "company", label: "Company", icon: "🏢", path: "/company-profile" },
  ];

  const currentTab = currentPage || activeTab || "dashboard";

  const handleNavigation = (path: string, tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout?.();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">K2020 OHSE</h1>
        <div className="sidebar-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="sidebar-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          {mainTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${currentTab === tab.id ? "active" : ""}`}
              onClick={() => handleNavigation(tab.path, tab.id)}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              {!isCollapsed && <span className="nav-label">{tab.label}</span>}
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Modules</div>
          {moduleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${currentTab === tab.id ? "active" : ""}`}
              onClick={() => handleNavigation(tab.path, tab.id)}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              {!isCollapsed && <span className="nav-label">{tab.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        {(user?.email || userEmail) && !isCollapsed && (
          <div className="user-info">
            <p className="user-email">{user?.email || userEmail}</p>
          </div>
        )}
        <button className="btn-logout" onClick={handleLogout} title="Logout">
          {!isCollapsed ? "🚪 Logout" : "🚪"}
        </button>
      </div>
    </aside>
  );
}
