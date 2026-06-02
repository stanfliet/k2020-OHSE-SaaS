import { Router, Request, Response } from "express";
import { authenticateUser } from "./rbac";

// Import all API services
import { analyzeDocumentWithClaude } from "./claude-ai";
import { sendIncidentAlert, sendEmail } from "./email";
import { sendIncidentAlertSMS } from "./sms";
import { analyzeImageForHazards, detectUnsafeConditions } from "./vision";
import { textToSpeech, generateTrainingAudio } from "./tts";
import { extractTextFromImageOCR, digitizeDocument } from "./ocr";
import {
  generateComplianceReport,
  generateIncidentReport,
} from "./reports";
import {
  classifyIncidentText,
  predictSafetyRisk,
  generateSafetyRecommendations,
} from "./ml";
import {
  geocodeAddress,
  findEmergencyServices,
  getStaticMapUrl,
} from "./maps";

export const integrationRouter = Router();

// Apply authentication middleware
integrationRouter.use((req, res, next) => {
  authenticateUser(req, res, next);
});

/**
 * POST /api/integration/analyze-document-claude
 * Analyze document using Claude 3.5 Sonnet instead of GPT-4
 */
integrationRouter.post(
  "/analyze-document-claude",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { content, documentType = "safety" } = req.body;

      if (!content) {
        return res
          .status(400)
          .json({ error: "Document content is required" });
      }

      const analysis = await analyzeDocumentWithClaude(content, documentType);
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/send-incident-notifications
 * Send incident alerts via email and SMS
 */
integrationRouter.post(
  "/send-incident-notifications",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { email, phoneNumber, incidentType, severity, description, location, timestamp } = req.body;

      const emailPromise = email
        ? sendIncidentAlert(email, {
            type: incidentType,
            severity,
            description,
            location,
            timestamp,
          })
        : Promise.resolve("email-skipped");

      const smsPromise = phoneNumber
        ? sendIncidentAlertSMS([phoneNumber], incidentType, severity)
        : Promise.resolve("sms-skipped");

      const [emailResult, smsResult] = await Promise.all([
        emailPromise,
        smsPromise,
      ]);

      res.json({
        success: true,
        emailId: emailResult,
        smsId: smsResult,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/analyze-safety-image
 * Analyze image for safety hazards using Claude Vision
 */
integrationRouter.post(
  "/analyze-safety-image",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { imagePath } = req.body;

      if (!imagePath) {
        return res.status(400).json({ error: "Image path is required" });
      }

      const [hazardAnalysis, unsafeConditions] = await Promise.all([
        analyzeImageForHazards(imagePath),
        detectUnsafeConditions(imagePath),
      ]);

      res.json({
        success: true,
        hazards: hazardAnalysis,
        safetyStatus: unsafeConditions,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/generate-training-audio
 * Generate safety training audio using ElevenLabs
 */
integrationRouter.post(
  "/generate-training-audio",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { trainingContent, trainingTitle } = req.body;

      if (!trainingContent || !trainingTitle) {
        return res
          .status(400)
          .json({ error: "Content and title are required" });
      }

      const audioPath = await generateTrainingAudio(
        trainingContent,
        trainingTitle
      );

      res.json({
        success: true,
        audioPath,
        message: "Training audio generated successfully",
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/digitize-document
 * Digitize scanned document using Tesseract OCR
 */
integrationRouter.post(
  "/digitize-document",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { imagePath } = req.body;

      if (!imagePath) {
        return res.status(400).json({ error: "Image path is required" });
      }

      const result = await digitizeDocument(imagePath);

      res.json({
        success: true,
        text: result.text,
        confidence: result.confidence,
        isHighQuality: result.success,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/generate-compliance-report
 * Generate Excel compliance report using ExcelJS
 */
integrationRouter.post(
  "/generate-compliance-report",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { companyName, findings, summary } = req.body;

      if (!companyName || !findings || !summary) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const reportPath = await generateComplianceReport(
        {
          companyName,
          reportDate: new Date().toISOString().split("T")[0],
          findings,
          summary,
        },
        `./compliance-${Date.now()}.xlsx`
      );

      res.json({
        success: true,
        reportPath,
        message: "Compliance report generated",
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/classify-incident
 * Classify incident severity using Hugging Face ML
 */
integrationRouter.post(
  "/classify-incident",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { incidentDescription } = req.body;

      if (!incidentDescription) {
        return res
          .status(400)
          .json({ error: "Incident description is required" });
      }

      const [classification, prediction] = await Promise.all([
        classifyIncidentText(incidentDescription, [
          "critical",
          "high",
          "medium",
          "low",
        ]),
        predictSafetyRisk(incidentDescription),
      ]);

      res.json({
        success: true,
        classification,
        prediction,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/find-emergency-services
 * Find nearby emergency services using Google Maps
 */
integrationRouter.post(
  "/find-emergency-services",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { lat, lng, address } = req.body;

      if (!lat || !lng) {
        if (!address) {
          return res
            .status(400)
            .json({ error: "Location coordinates or address required" });
        }

        // Geocode address
        const { lat: geocodedLat, lng: geocodedLng } =
          await geocodeAddress(address);
        const services = await findEmergencyServices(geocodedLat, geocodedLng);

        return res.json({
          success: true,
          location: address,
          coordinates: { lat: geocodedLat, lng: geocodedLng },
          services,
        });
      }

      const services = await findEmergencyServices(lat, lng);
      const mapUrl = getStaticMapUrl(lat, lng);

      res.json({
        success: true,
        location: { lat, lng },
        services,
        mapUrl,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/generate-ml-recommendations
 * Generate safety recommendations using Hugging Face
 */
integrationRouter.post(
  "/generate-ml-recommendations",
  async (req: Request & { user?: any }, res: Response) => {
    try {
      const { riskDescription } = req.body;

      if (!riskDescription) {
        return res
          .status(400)
          .json({ error: "Risk description is required" });
      }

      const recommendations =
        await generateSafetyRecommendations(riskDescription);

      res.json({
        success: true,
        recommendations,
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
);

/**
 * POST /api/integration/health
 * Check integration health
 */
integrationRouter.get("/health", async (req: Request, res: Response) => {
  try {
    const health = {
      status: "operational",
      apis: {
        claude: !!process.env.ANTHROPIC_API_KEY,
        resend: !!process.env.RESEND_API_KEY,
        twilio: !!process.env.TWILIO_ACCOUNT_SID,
        googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
        elevenLabs: !!process.env.ELEVENLABS_API_KEY,
        huggingFace: !!process.env.HUGGINGFACE_API_KEY,
      },
      timestamp: new Date().toISOString(),
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default integrationRouter;
