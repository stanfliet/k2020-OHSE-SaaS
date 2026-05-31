// API utility functions
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadAndAnalyzeDocuments(files: File[]): Promise<any> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const response = await fetch(`${API_URL}/api/upload-and-analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Document upload failed:", error);
    throw error;
  }
}

export async function generateDocuments(projectData: any, analysisData: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/generate-documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectData, analysisData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Generation failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Document generation failed:", error);
    throw error;
  }
}

export async function downloadDocument(content: string, filename: string): Promise<void> {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function extractErrorMessage(error: any): string {
  if (typeof error === "string") return error;
  if (error.message) return error.message;
  if (error.error) return error.error;
  return "An unknown error occurred";
}
