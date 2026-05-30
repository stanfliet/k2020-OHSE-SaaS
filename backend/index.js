import express from "express";
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

const isProduction = process.env.NODE_ENV === "production";

console.log("Environment:", process.env.NODE_ENV);
console.log("Production Mode:", isProduction);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const corsOrigin = process.env.NODE_ENV === "production" 
  ? [process.env.CORS_ORIGIN_PROD, "https://k2020-ohse-s.vercel.app"]
  : [process.env.CORS_ORIGIN || "http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "image/png", "image/jpeg"];
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

// Helper function to extract text from PDF
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  } catch (error) {
    console.error("Error extracting PDF:", error);
    return "";
  }
}

// Helper function to extract text from DOCX (basic implementation)
async function extractTextFromDOCX(filePath) {
  // For now, we'll return placeholder text
  // In production, use docx-parser or similar library
  return "DOCX content extraction would be implemented here";
}

// Helper function to extract text from text files
function extractTextFromTXT(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    console.error("Error reading TXT:", error);
    return "";
  }
}

// Helper function to analyze text with OpenAI
async function analyzeWithAI(text, analysisType = "general") {
  try {
    let systemPrompt = "";
    
    switch(analysisType) {
      case "scopeOfWorks":
        systemPrompt = "You are an expert construction and OHSE analyst. Extract and summarize the construction scope of works from the provided text. Focus on: project description, activities, timelines, compliance requirements, safety requirements, contractor info, and location. Return as structured JSON.";
        break;
      case "riskAssessment":
        systemPrompt = "You are an expert in health and safety risk assessment. Analyze the provided text and identify: hazards, risks, likelihood, severity, controls, and recommendations. Return as structured JSON.";
        break;
      case "methodStatement":
        systemPrompt = "You are an expert in construction method statements. Create a detailed method statement including: scope, procedures, resources, timelines, safety controls, and quality measures. Return as structured JSON.";
        break;
      default:
        systemPrompt = "You are an expert construction and OHSE consultant. Analyze the provided text and extract key information. Return as structured JSON with relevant fields.";
    }

    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL || "gpt-4-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text.substring(0, 12000) // Limit text to avoid token overflow
        }
      ],
      temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}

// Routes

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// File upload and analysis endpoint
app.post("/api/upload-and-analyze", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files provided"
      });
    }

    let combinedText = "";
    const fileDetails = [];

    // Extract text from all files
    for (const file of req.files) {
      let extractedText = "";
      const fileExt = path.extname(file.originalname).toLowerCase();

      try {
        if (fileExt === ".pdf") {
          extractedText = await extractTextFromPDF(file.path);
        } else if (fileExt === ".docx") {
          extractedText = await extractTextFromDOCX(file.path);
        } else if (fileExt === ".txt") {
          extractedText = await extractTextFromTXT(file.path);
        } else if ([".png", ".jpg", ".jpeg"].includes(fileExt)) {
          extractedText = "Image content extraction would be implemented here";
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
      // If not valid JSON, wrap in object
      analysisData = {
        analysis: analysis,
        raw: true
      };
    }

    // Cleanup temporary files
    for (const file of req.files) {
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

    // Cleanup on error
    if (req.files) {
      for (const file of req.files) {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    }

    res.status(500).json({
      success: false,
      error: error.message || "File upload failed"
    });
  }
});

// Generate OHSE Documents endpoint
app.post("/api/generate-documents", express.json(), async (req, res) => {
  try {
    const { projectData, analysisData } = req.body;

    if (!analysisData || !projectData) {
      return res.status(400).json({
        success: false,
        error: "Missing project or analysis data"
      });
    }

    const documents = {
      healthSafetyPlan: null,
      riskAssessment: null,
      methodStatement: null,
      incidentReport: null,
      toolboxTalk: null,
      safetyFile: null,
      sheqDocuments: null,
      complianceForms: null,
      inspectionChecklist: null,
      ppeRegister: null
    };

    // Generate each document type
    const documentTypes = [
      { key: "healthSafetyPlan", prompt: "Generate a comprehensive Health & Safety Plan for this project" },
      { key: "riskAssessment", prompt: "Generate a detailed Risk Assessment Report" },
      { key: "methodStatement", prompt: "Generate a Method Statement for construction activities" },
      { key: "incidentReport", prompt: "Generate an Incident Report template" },
      { key: "toolboxTalk", prompt: "Generate a Toolbox Talk content" },
      { key: "safetyFile", prompt: "Generate a Safety File documentation" },
      { key: "sheqDocuments", prompt: "Generate SHEQ compliance documents" },
      { key: "complianceForms", prompt: "Generate compliance forms and checklists" },
      { key: "inspectionChecklist", prompt: "Generate inspection and audit checklists" },
      { key: "ppeRegister", prompt: "Generate a PPE register template" }
    ];

    for (const docType of documentTypes) {
      try {
        const completion = await client.chat.completions.create({
          model: process.env.AI_MODEL || "gpt-4-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert OHSE and construction compliance consultant. Generate professional, detailed, and complete documents."
            },
            {
              role: "user",
              content: `${docType.prompt}\n\nProject Data: ${JSON.stringify(projectData)}\n\nAnalysis Data: ${JSON.stringify(analysisData).substring(0, 5000)}`
            }
          ],
          temperature: 0.7
        });

        documents[docType.key] = completion.choices[0].message.content;
      } catch (error) {
        console.error(`Error generating ${docType.key}:`, error);
        documents[docType.key] = `Error generating ${docType.key}: ${error.message}`;
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
      error: error.message || "Document generation failed"
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API URL: http://localhost:${PORT}`);
});