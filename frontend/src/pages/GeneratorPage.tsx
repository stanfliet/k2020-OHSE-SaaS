import React from "react";
import "../styles/Generator.css";

interface GeneratorPageProps {
  documents: Record<string, string> | null;
  isLoading: boolean;
}

export function GeneratorPage({ documents, isLoading }: GeneratorPageProps) {
  return (
    <div className="page-container generator-page">
      <h1>Document Generator</h1>
      {isLoading && <p>Generating documents, please wait...</p>}

      {!isLoading && !documents && (
        <div className="empty-state">
          <p>No generated documents yet. Upload and analyze documents first.</p>
        </div>
      )}

      {!isLoading && documents && (
        <div className="generated-docs-grid">
          {Object.entries(documents).map(([key, content]) => (
            <div key={key} className="generated-doc-card">
              <h2>{formatDocumentTitle(key)}</h2>
              <div className="doc-content">
                <pre>{content}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDocumentTitle(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Health safety/i, "Health & Safety");
}
