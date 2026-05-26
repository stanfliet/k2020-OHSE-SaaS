// Validation middleware
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateProjectData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Project name is required");
  }

  if (data.name && data.name.length > 255) {
    errors.push("Project name must be less than 255 characters");
  }

  if (data.location && data.location.length > 255) {
    errors.push("Location must be less than 255 characters");
  }

  if (data.description && data.description.length > 5000) {
    errors.push("Description must be less than 5000 characters");
  }

  if (data.status && !["active", "on_hold", "completed", "archived"].includes(data.status)) {
    errors.push("Invalid project status");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFileType(mimetype: string, allowedTypes: string[] = []): boolean {
  const defaultAllowed = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/png",
    "image/jpeg",
  ];

  const typesToCheck = allowedTypes.length > 0 ? allowedTypes : defaultAllowed;
  return typesToCheck.includes(mimetype);
}

export function validateFileSize(fileSize: number, maxSize: number = 52428800): boolean {
  return fileSize <= maxSize;
}

// Rate limiting
export const createRateLimiter = (windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) => {
  const requests: { [key: string]: number[] } = {};

  return (ip: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests[ip]) {
      requests[ip] = [];
    }

    // Remove old requests outside the window
    requests[ip] = requests[ip].filter((timestamp) => timestamp > windowStart);

    if (requests[ip].length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    requests[ip].push(now);
    return true; // Request allowed
  };
};

// Error handling
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const handleError = (error: any) => {
  if (error instanceof APIError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      code: error.code,
    };
  }

  if (error.name === "ValidationError") {
    return {
      statusCode: 400,
      message: "Validation error",
      details: error.message,
    };
  }

  console.error("Unexpected error:", error);
  return {
    statusCode: 500,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  };
};

// Authentication utilities
export function validateToken(token: string): boolean {
  if (!token) return false;
  if (!token.startsWith("Bearer ")) return false;
  return token.length > 7;
}

export function extractToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.substring(7);
}

// Data transformation
export function sanitizeProjectData(data: any): any {
  return {
    name: (data.name || "").trim().substring(0, 255),
    description: (data.description || "").trim().substring(0, 5000),
    location: (data.location || "").trim().substring(0, 255),
    status: data.status || "active",
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export function sanitizeAnalysisData(data: any): any {
  return {
    ...data,
    timestamp: new Date().toISOString(),
    version: "1.0",
  };
}

// Response formatting
export const sendSuccess = (data: any, message: string = "Success") => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

export const sendError = (message: string, statusCode: number = 500, code?: string) => {
  return {
    success: false,
    message,
    code: code || `ERROR_${statusCode}`,
    timestamp: new Date().toISOString(),
  };
};
