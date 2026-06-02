import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";

/**
 * Extract text from image using Tesseract OCR
 */
export async function extractTextFromImageOCR(
  imagePath: string
): Promise<string> {
  try {
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m: any) => console.log("OCR Progress:", m.progress),
    });

    return result.data.text;
  } catch (error) {
    console.error("Tesseract OCR error:", error);
    throw error;
  }
}

/**
 * Extract text with confidence scores
 */
export async function extractTextWithConfidence(
  imagePath: string
): Promise<{
  text: string;
  confidence: number;
  details: any[];
}> {
  try {
    const result = await Tesseract.recognize(imagePath, "eng");

    const confidence = result.data.confidence;
    const details = result.data.paragraphs || [];

    return {
      text: result.data.text,
      confidence: confidence,
      details,
    };
  } catch (error) {
    console.error("Text extraction with confidence error:", error);
    throw error;
  }
}

/**
 * Digitize scanned document
 */
export async function digitizeDocument(
  imagePath: string,
  outputPath?: string
): Promise<{
  text: string;
  confidence: number;
  success: boolean;
}> {
  try {
    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text;
    const confidence = result.data.confidence;

    // Save to text file if output path provided
    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, text);
    }

    return {
      text,
      confidence,
      success: confidence > 50,
    };
  } catch (error) {
    console.error("Document digitization error:", error);
    throw error;
  }
}

/**
 * Extract tabular data from document image
 */
export async function extractTableData(
  imagePath: string
): Promise<{
  rows: string[][];
  confidence: number;
}> {
  try {
    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text;
    const confidence = result.data.confidence;

    // Simple row extraction (split by newlines, columns by spaces/tabs)
    const rows = text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => line.split(/\s{2,}|\t/));

    return {
      rows,
      confidence,
    };
  } catch (error) {
    console.error("Table extraction error:", error);
    throw error;
  }
}

/**
 * Batch process multiple document images
 */
export async function batchOCRProcess(
  imagePaths: string[],
  outputDir: string = "./ocr-output"
): Promise<
  Array<{
    imagePath: string;
    success: boolean;
    text?: string;
    error?: string;
  }>
> {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = await Promise.all(
      imagePaths.map(async (imagePath) => {
        try {
          const result = await Tesseract.recognize(imagePath, "eng");
          const text = result.data.text;

          const basename = path.basename(imagePath, path.extname(imagePath));
          const outputFile = path.join(outputDir, `${basename}.txt`);
          fs.writeFileSync(outputFile, text);

          return {
            imagePath,
            success: true,
            text,
          };
        } catch (error) {
          return {
            imagePath,
            success: false,
            error: (error as Error).message,
          };
        }
      })
    );

    return results;
  } catch (error) {
    console.error("Batch OCR processing error:", error);
    throw error;
  }
}

/**
 * Extract specific information from scanned document
 */
export async function extractDocumentInfo(
  imagePath: string,
  infoType: "invoice" | "receipt" | "identity" | "contract"
): Promise<Record<string, any>> {
  try {
    const result = await Tesseract.recognize(imagePath, "eng");
    const text = result.data.text;

    // Simple pattern matching for different document types
    const patterns = {
      invoice: {
        invoiceNumber: /Invoice\s*#?\s*(\d+)/i,
        amount: /Total\s*[\$€£]?\s*([\d.,]+)/i,
        date: /Date\s*[\:]\s*(\d{1,2}\/\d{1,2}\/\d{4})/i,
      },
      receipt: {
        merchant: /Merchant\s*:\s*(.+)/i,
        amount: /Total\s*[\$€£]?\s*([\d.,]+)/i,
        date: /Date\s*:\s*(.+)/i,
      },
      identity: {
        name: /Name\s*[\:]\s*(.+)/i,
        idNumber: /ID\s*[\:]\s*(.+)/i,
        dateOfBirth: /DOB\s*[\:]\s*(.+)/i,
      },
      contract: {
        parties: /between\s*(.+?)\s*and\s*(.+)/i,
        date: /dated\s*(\d{1,2}\s+\w+\s+\d{4})/i,
        amount: /[\$€£]\s*([\d.,]+)/i,
      },
    };

    const extractedInfo: Record<string, any> = {};
    const docPatterns = patterns[infoType] || {};

    for (const [key, pattern] of Object.entries(docPatterns)) {
      const match = text.match(pattern as RegExp);
      if (match) {
        extractedInfo[key] = match[1] || match[0];
      }
    }

    return extractedInfo;
  } catch (error) {
    console.error("Document info extraction error:", error);
    throw error;
  }
}
