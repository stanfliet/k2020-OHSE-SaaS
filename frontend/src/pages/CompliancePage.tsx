import React, { useState } from "react";
import "../styles/Compliance.css";

interface ComplianceItem {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  dueDate?: string;
  category: string;
}

export function CompliancePage() {
  const [items, setItems] = useState<ComplianceItem[]>([
    {
      id: "1",
      title: "Health & Safety Plan",
      status: "completed",
      category: "Documentation",
      dueDate: "2026-05-30",
    },
    {
      id: "2",
      title: "Risk Assessment Review",
      status: "in-progress",
      category: "Assessment",
      dueDate: "2026-05-28",
    },
    {
      id: "3",
      title: "Site Inspection",
      status: "pending",
      category: "Inspection",
      dueDate: "2026-06-05",
    },
    {
      id: "4",
      title: "PPE Audit",
      status: "pending",
      category: "Equipment",
      dueDate: "2026-06-10",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "in-progress":
        return "status-progress";
      case "pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const toggleStatus = (id: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const statuses: Array<"completed" | "in-progress" | "pending"> = [
            "pending",
            "in-progress",
            "completed",
          ];
          const currentIndex = statuses.indexOf(item.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const stats = {
    total: items.length,
    completed: items.filter((i) => i.status === "completed").length,
    inProgress: items.filter((i) => i.status === "in-progress").length,
    pending: items.filter((i) => i.status === "pending").length,
  };

  return (
    <div className="compliance-container">
      <div className="compliance-header">
        <h1>Compliance Management</h1>
        <p>Track and manage all compliance requirements</p>
      </div>

      <div className="compliance-stats">
        <div className="stat-card stat-total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="compliance-content">
        {categories.map((category) => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            <div className="compliance-list">
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="compliance-item">
                    <button
                      className={`status-button ${getStatusColor(item.status)}`}
                      onClick={() => toggleStatus(item.id)}
                      title={`Click to change status from ${item.status}`}
                    >
                      {item.status === "completed" && "✓"}
                      {item.status === "in-progress" && "◐"}
                      {item.status === "pending" && "○"}
                    </button>
                    <div className="item-info">
                      <h3>{item.title}</h3>
                      {item.dueDate && (
                        <p className="due-date">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className={`status-badge ${getStatusColor(item.status)}`}>
                      {item.status}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
