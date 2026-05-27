import React, { useState } from "react";
import { useAuth } from "../lib/AuthContext";
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

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "analysis", label: "AI Analysis", icon: "🤖" },
    { id: "generator", label: "Doc Generator", icon: "✨" },
    { id: "compliance", label: "Compliance", icon: "✅" },
  ];

  const currentTab = currentPage || activeTab || "dashboard";

  const handleTabChange = (tab: string) => {
    onNavigate ? onNavigate(tab) : onTabChange?.(tab);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout?.();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">K2020 OHSE</h1>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      <nav className="sidebar-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${currentTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
            title={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            {!isCollapsed && <span className="nav-label">{tab.label}</span>}
          </button>
        ))}
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
