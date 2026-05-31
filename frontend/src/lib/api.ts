import { supabase } from "./supabase";

const API_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
console.log("API URL:", API_URL);

async function getAuthHeaders() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Auth session error:", error);
      return {};
    }
    const token = data?.session?.access_token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log("getAuthHeaders", { hasToken: !!token, headers });
    return headers;
  } catch (error) {
    console.error("Auth header error:", error);
    return {};
  }
}

// Health Check
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.error("API health check failed:", error);
    return false;
  }
}

export async function uploadAndAnalyzeDocuments(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/upload-and-analyze`, {
      method: "POST",
      headers,
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
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/generate-documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
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

// Projects Management
export async function getProjects() {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Get projects error:", error);
    return [];
  }
}

export async function createProject(projectData: any) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.project;
  } catch (error) {
    console.error("Create project error:", error);
    throw error;
  }
}

export async function deleteProject(projectId: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete project error:", error);
    throw error;
  }
}


