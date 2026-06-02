import dotenv from "dotenv";
dotenv.config(); // Load environment variables FIRST, before any other imports

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse";
import { createClient } from "@supabase/supabase-js";
import mammoth from "mammoth";
import OpenAI from "openai";

// Import routes and middleware
import { requireRole, requireMinimumRole, authenticateUser } from "./rbac";
import {
  companyRouter,
  projectRouter,
  safetyRouter,
  documentRouter,
  documentExportRouter,
  trainingRouter,
  incidentRouter,
  complianceRouter,
  environmentalRouter,
  qualityRouter,
  qsRouter,
} from "./routes";
import integrationRouter from "./integration-routes";

const isProduction = process.env.NODE_ENV === "production";
console.log("Environment:", process.env.NODE_ENV);
console.log("Production Mode:", isProduction);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN_PROD,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean));

console.log("Allowed CORS origins:", [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// Authentication routes
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) throw error;

    res.json({
      success: true,
      user: data.user,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Middleware to attach authenticated user to request
app.use(async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (token) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error) {
        req.user = data.user;
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  }

  next();
});

// Protected routes
app.use("/api/company", companyRouter);
app.use("/api/projects", projectRouter);
app.use("/api/safety", safetyRouter);
app.use("/api/documents", documentRouter);
app.use("/api/documents", documentExportRouter);
app.use("/api/training", trainingRouter);
app.use("/api/incidents", incidentRouter);
app.use("/api/compliance", complianceRouter);
app.use("/api/environmental", environmentalRouter);
app.use("/api/quality", qualityRouter);
app.use("/api/qs", qsRouter);
app.use("/api/integration", integrationRouter);

// Document upload and analysis endpoint
app.post(
  "/api/upload-document",
  upload.single("file"),
  async (req: Request & { user?: any }, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const fileName = req.file.originalname;
      const fileExtension = path.extname(fileName).toLowerCase();

      let extractedText = "";

      // Parse PDF
      if (fileExtension === ".pdf") {
        const pdfData = fs.readFileSync(filePath);
        const pdfText = await pdf(pdfData);
        extractedText = pdfText.text;
      }

      // Parse DOCX
      if (fileExtension === ".docx") {
        const docxBuffer = fs.readFileSync(filePath);
        const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
        extractedText = docxResult.value;
      }

      // Parse text files
      if (fileExtension === ".txt") {
        extractedText = fs.readFileSync(filePath, "utf-8");
      }

      // Use OpenAI to analyze document
      const aiAnalysis = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              'You are an expert construction AI. Extract structured data from construction documents. Return valid JSON with fields: projectName, client, scope, activities, risks, duration, startDate, endDate.',
          },
          {
            role: "user",
            content: `Analyze this document and extract key construction data:\n\n${extractedText.substring(0, 4000)}`,
          },
        ],
      });

      let analysisData = {};
      const content = aiAnalysis.choices[0].message.content || "";

      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisData = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
      }

      // Store in Supabase
      const { data: uploadedFile, error: uploadError } =
        await supabase.storage
          .from("documents")
          .upload(`${req.user.id}/${Date.now()}-${fileName}`, fs.readFileSync(filePath));

      if (uploadError) throw uploadError;

      // Insert document record
      const { data: docRecord, error: dbError } = await supabase
        .from("uploaded_documents")
        .insert({
          user_id: req.user.id,
          file_name: fileName,
          file_path: uploadedFile.path,
          extracted_text: extractedText.substring(0, 50000),
          analysis: analysisData,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Clean up local file
      fs.unlinkSync(filePath);

      res.json({
        success: true,
        document: docRecord,
        analysis: analysisData,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
