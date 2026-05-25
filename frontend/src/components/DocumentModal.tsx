import React, { useState, useRef } from "react";
import "../styles/DocumentModal.css";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  isLoading?: boolean;
}

export function DocumentModal({ isOpen, onClose, onUpload, isLoading }: DocumentModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Documents</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div
            className={`drop-zone ${dragOver ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
              onChange={(e) => handleFileSelect(e.target.files)}
              style={{ display: "none" }}
            />
            <button
              className="btn-select-files"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              📁 Select Files
            </button>
            <p>or drag and drop files here</p>
            <p className="text-small">Supported: PDF, DOCX, TXT, PNG, JPG</p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="file-list">
              <h3>Selected Files ({selectedFiles.length})</h3>
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="file-item">
                  <span>📄 {file.name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
