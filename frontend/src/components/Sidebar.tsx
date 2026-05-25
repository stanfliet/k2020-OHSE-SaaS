import React, { useState } from "react";
import "../styles/Sidebar.css";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
  onLogout?: () => void;
}

export function Sidebar({ activeTab, onTabChange, userEmail, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "analysis", label: "AI Analysis", icon: "🤖" },
    { id: "generator", label: "Doc Generator", icon: "✨" },
    { id: "compliance", label: "Compliance", icon: "✓" },
  ];

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
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <span className="nav-icon">{tab.icon}</span>
            {!isCollapsed && <span className="nav-label">{tab.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {userEmail && !isCollapsed && (
          <div className="user-info">
            <p className="user-email">{userEmail}</p>
          </div>
        )}
        {onLogout && (
          <button className="btn-logout" onClick={onLogout} title="Logout">
            {!isCollapsed ? "Logout" : "🚪"}
          </button>
        )}
      </div>
    </aside>
  );
}
