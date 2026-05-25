import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const app: Express = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOrigin = process.env.NODE_ENV === "production" 
  ? process.env.CORS_ORIGIN_PROD || process.env.CORS_ORIGIN
  : process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Setup file uploads
const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
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
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || "52428800") },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/png",
      "image/jpeg"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

// Initialize OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper functions
async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return "";
  }
}

async function extractTextFromDOCX(filePath: string): Promise<string> {
  // For production, use docx-parser or similar
  return "DOCX content extraction implemented here";
}

function extractTextFromTXT(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading TXT:", error);
    return "";
  }
}

async function analyzeWithAI(text: string, analysisType: string = "general"): Promise<string> {
  try {
    const systemPrompts: { [key: string]: string } = {
      scopeOfWorks: "Extract and summarize construction scope of works focusing on activities, timeline, compliance and safety requirements.",
      riskAssessment: "Analyze and identify hazards, risks, likelihood, severity and recommended controls.",
      methodStatement: "Create detailed method statement including procedures, resources, timelines and safety controls.",
      general: "Analyze and extract key information from construction documents in structured JSON format."
    };

    const systemPrompt = systemPrompts[analysisType] || systemPrompts.general;

    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text.substring(0, 12000)
        }
      ],
      temperature: parseFloat(process.env.AI_TEMPERATURE || "0.7"),
      max_tokens: 2000
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}

// Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

app.post("/api/upload-and-analyze", upload.array("files", 10), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files provided"
      });
    }

    let combinedText = "";
    const fileDetails = [];

    // Extract text from all files
    for (const file of files) {
      let extractedText = "";
      const fileExt = path.extname(file.originalname).toLowerCase();

      try {
        if (fileExt === ".pdf") {
          extractedText = await extractTextFromPDF(file.path);
        } else if (fileExt === ".docx") {
          extractedText = await extractTextFromDOCX(file.path);
        } else if (fileExt === ".txt") {
          extractedText = extractTextFromTXT(file.path);
        }

        combinedText += extractedText + "\n---\n";
        fileDetails.push({
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          extracted: extractedText.length > 0
        });
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
      }
    }

    if (!combinedText.trim()) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text from any files"
      });
    }

    // Analyze with AI
    const analysis = await analyzeWithAI(combinedText, "scopeOfWorks");

    // Parse AI response
    let analysisData;
    try {
      analysisData = JSON.parse(analysis);
    } catch {
      analysisData = {
        analysis: analysis,
        raw: true
      };
    }

    // Cleanup temporary files
    for (const file of files) {
      fs.unlink(file.path, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
    }

    res.json({
      success: true,
      analysis: analysisData,
      fileDetails: fileDetails,
      textLength: combinedText.length
    });

  } catch (error) {
    console.error("Upload error:", error);

    const files = req.files as Express.Multer.File[];
    if (files) {
      for (const file of files) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    }

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "File upload failed"
    });
  }
});

app.post("/api/generate-documents", async (req: Request, res: Response) => {
  try {
    const { projectData, analysisData } = req.body;

    if (!analysisData || !projectData) {
      return res.status(400).json({
        success: false,
        error: "Missing project or analysis data"
      });
    }

    const documents: { [key: string]: string } = {
      healthSafetyPlan: "",
      riskAssessment: "",
      methodStatement: "",
      incidentReport: "",
      toolboxTalk: "",
      safetyFile: "",
      sheqDocuments: "",
      complianceForms: "",
      inspectionChecklist: "",
      ppeRegister: ""
    };

    const documentTypes = [
      { key: "healthSafetyPlan", prompt: "Generate a comprehensive Health & Safety Plan" },
      { key: "riskAssessment", prompt: "Generate a detailed Risk Assessment Report" },
      { key: "methodStatement", prompt: "Generate a Method Statement for construction" },
      { key: "incidentReport", prompt: "Generate an Incident Report template" },
      { key: "toolboxTalk", prompt: "Generate Toolbox Talk content" },
      { key: "safetyFile", prompt: "Generate Safety File documentation" }
    ];

    for (const docType of documentTypes) {
      try {
        const completion = await client.chat.completions.create({
          model: process.env.AI_MODEL || "gpt-4-mini",
          messages: [
            {
              role: "system",
              content: "Generate professional OHSE compliance documents"
            },
            {
              role: "user",
              content: `${docType.prompt}\n\nProject: ${JSON.stringify(projectData)}\n\nAnalysis: ${JSON.stringify(analysisData).substring(0, 5000)}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        });

        documents[docType.key] = completion.choices[0].message.content || "";
      } catch (error) {
        console.error(`Error generating ${docType.key}:`, error);
        documents[docType.key] = `Error generating ${docType.key}`;
      }
    }

    res.json({
      success: true,
      documents: documents,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Document generation error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Document generation failed"
    });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(400).json({
        success: false,
        error: "File too large"
      });
    }
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
    🚀 K2020 OHSE Backend Server
    ============================
    Port: ${PORT}
    Environment: ${process.env.NODE_ENV || "development"}
    API URL: http://localhost:${PORT}
    ============================
  `);
});