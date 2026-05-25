const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function uploadAndAnalyzeDocuments(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_URL}/api/upload-and-analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export async function generateDocuments(projectData: any, analysisData: any) {
  try {
    const response = await fetch(`${API_URL}/api/generate-documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectData,
        analysisData,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Generation error:", error);
    throw error;
  }
}

export async function checkAPIHealth() {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}
