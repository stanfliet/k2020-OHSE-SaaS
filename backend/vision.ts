import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analyze image for safety hazards using Claude Vision
 */
export async function analyzeImageForHazards(
  imagePath: string
): Promise<string> {
  try {
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    // Determine media type from file extension
    const ext = path.extname(imagePath).toLowerCase();
    const mediaType =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "Analyze this image for safety hazards and compliance issues. Identify: 1) Visible hazards, 2) PPE compliance, 3) Environmental concerns, 4) Risk severity (High/Medium/Low). Format as structured JSON.",
            },
          ],
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude Vision");
  } catch (error) {
    console.error("Vision analysis error:", error);
    throw error;
  }
}

/**
 * Extract text from document image using Claude Vision
 */
export async function extractTextFromImage(imagePath: string): Promise<string> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const ext = path.extname(imagePath).toLowerCase();
    const mediaType =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "Extract all visible text from this image. Preserve formatting and structure as much as possible.",
            },
          ],
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude Vision");
  } catch (error) {
    console.error("Text extraction error:", error);
    throw error;
  }
}

/**
 * Analyze safety equipment in image
 */
export async function analyzeSafetyEquipment(
  imagePath: string
): Promise<string> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const ext = path.extname(imagePath).toLowerCase();
    const mediaType =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "Analyze safety equipment visible in this image. Identify: 1) Required vs present equipment, 2) Proper usage, 3) Condition of equipment, 4) Compliance gaps. Format as JSON.",
            },
          ],
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude Vision");
  } catch (error) {
    console.error("Safety equipment analysis error:", error);
    throw error;
  }
}

/**
 * Detect unsafe conditions in image
 */
export async function detectUnsafeConditions(
  imagePath: string
): Promise<{
  safe: boolean;
  hazards: string[];
  severity: "High" | "Medium" | "Low";
  recommendations: string[];
}> {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const ext = path.extname(imagePath).toLowerCase();
    const mediaType =
      ext === ".png"
        ? "image/png"
        : ext === ".gif"
          ? "image/gif"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/gif"
                  | "image/webp",
                data: base64Image,
              },
            },
            {
              type: "text",
              text: 'Return ONLY valid JSON with this structure: {"safe": boolean, "hazards": ["list"], "severity": "High|Medium|Low", "recommendations": ["list"]}',
            },
          ],
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return JSON.parse(response.text);
    }

    throw new Error("Unexpected response type from Claude Vision");
  } catch (error) {
    console.error("Unsafe condition detection error:", error);
    throw error;
  }
}
