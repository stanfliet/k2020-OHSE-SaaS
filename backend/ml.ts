import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Classify incident text using HuggingFace
 */
export async function classifyIncidentText(
  text: string,
  labels: string[] = ["high", "medium", "low"]
): Promise<{
  label: string;
  scores: Record<string, number>;
}> {
  try {
    const result = (await hf.zeroShotClassification({
      model: "facebook/bart-large-mnli",
      inputs: text,
      candidate_labels: labels,
    })) as any;

    const scores: Record<string, number> = {};
    result.labels.forEach((label: string, idx: number) => {
      scores[label] = result.scores[idx];
    });

    return {
      label: result.labels[0],
      scores,
    };
  } catch (error) {
    console.error("Incident classification error:", error);
    throw error;
  }
}

/**
 * Predict safety risk using ML model
 */
export async function predictSafetyRisk(
  riskFactors: string
): Promise<{
  riskLevel: string;
  confidence: number;
  recommendations: string[];
}> {
  try {
    const classification = await classifyIncidentText(riskFactors, [
      "critical risk",
      "high risk",
      "medium risk",
      "low risk",
    ]);

    const riskMap: Record<string, string> = {
      "critical risk": "Critical",
      "high risk": "High",
      "medium risk": "Medium",
      "low risk": "Low",
    };

    const recommendations = {
      Critical: [
        "Immediate intervention required",
        "Escalate to management",
        "Implement emergency protocols",
      ],
      High: [
        "Schedule urgent review",
        "Increase monitoring frequency",
        "Develop action plan",
      ],
      Medium: [
        "Monitor regularly",
        "Update safety procedures",
        "Provide staff training",
      ],
      Low: ["Continue normal operations", "Document findings", "Schedule review"],
    };

    return {
      riskLevel: riskMap[classification.label] || "Unknown",
      confidence: classification.scores[classification.label] || 0,
      recommendations:
        recommendations[riskMap[classification.label] || "Unknown"] || [],
    };
  } catch (error) {
    console.error("Safety risk prediction error:", error);
    throw error;
  }
}

/**
 * Sentiment analysis on incident reports
 */
export async function analyzeIncidentSentiment(
  text: string
): Promise<{
  sentiment: string;
  confidence: number;
}> {
  try {
    const result = (await hf.textClassification({
      model: "distilbert-base-uncased-finetuned-sst-2-english",
      inputs: text,
    })) as any;

    if (Array.isArray(result) && result.length > 0) {
      return {
        sentiment: result[0].label.toLowerCase(),
        confidence: result[0].score,
      };
    }

    throw new Error("Unexpected sentiment analysis response");
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    throw error;
  }
}

/**
 * Named Entity Recognition for incident extraction
 */
export async function extractEntitiesFromIncident(
  text: string
): Promise<
  Array<{
    entity: string;
    word: string;
    score: number;
    start: number;
    end: number;
  }>
> {
  try {
    const result = (await hf.tokenClassification({
      model: "dbmdz/bert-base-cased-finetuned-conll03-english",
      inputs: text,
    })) as any;

    return result.map(
      (item: {
        entity_group?: string;
        word?: string;
        score?: number;
        start?: number;
        end?: number;
      }) => ({
        entity: item.entity_group || "UNKNOWN",
        word: item.word || "",
        score: item.score || 0,
        start: item.start || 0,
        end: item.end || 0,
      })
    );
  } catch (error) {
    console.error("Entity extraction error:", error);
    throw error;
  }
}

/**
 * Generate text completions for safety recommendations
 */
export async function generateSafetyRecommendations(
  riskDescription: string
): Promise<string> {
  try {
    const result = (await hf.textGeneration({
      model: "gpt2",
      inputs: `Safety recommendation for: ${riskDescription}. `,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
      },
    })) as any;

    if (Array.isArray(result) && result.length > 0) {
      return result[0].generated_text.replace(riskDescription, "").trim();
    }

    return "Unable to generate recommendations";
  } catch (error) {
    console.error("Recommendation generation error:", error);
    throw error;
  }
}

/**
 * Question answering on safety policies
 */
export async function answerSafetyQuestion(
  context: string,
  question: string
): Promise<{
  answer: string;
  confidence: number;
  startCharIdx: number;
  endCharIdx: number;
}> {
  try {
    const result = (await hf.questionAnswering({
      model: "deepset/roberta-base-squad2",
      inputs: {
        question: question,
        context: context,
      },
    })) as any;

    return {
      answer: result.answer || "",
      confidence: result.score || 0,
      startCharIdx: result.start || 0,
      endCharIdx: result.end || 0,
    };
  } catch (error) {
    console.error("Question answering error:", error);
    throw error;
  }
}

/**
 * Summarize lengthy safety documents
 */
export async function summarizeDocument(
  text: string,
  maxLength: number = 150,
  minLength: number = 50
): Promise<string> {
  try {
    const result = (await hf.summarization({
      model: "facebook/bart-large-cnn",
      inputs: text,
      parameters: {
        max_length: maxLength,
        min_length: minLength,
      },
    })) as any;

    if (Array.isArray(result) && result.length > 0) {
      return result[0].summary_text;
    }

    return "Unable to summarize document";
  } catch (error) {
    console.error("Document summarization error:", error);
    throw error;
  }
}

/**
 * Detect anomalies in safety metrics
 */
export async function detectAnomalies(
  metrics: number[]
): Promise<{
  anomalies: Array<{ index: number; value: number; isAnomaly: boolean }>;
  threshold: number;
}> {
  try {
    const mean = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const stdDev = Math.sqrt(
      metrics.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / metrics.length
    );

    const threshold = mean + 2 * stdDev;

    const anomalies = metrics.map((value, index) => ({
      index,
      value,
      isAnomaly: Math.abs(value - mean) > 2 * stdDev,
    }));

    return {
      anomalies,
      threshold,
    };
  } catch (error) {
    console.error("Anomaly detection error:", error);
    throw error;
  }
}
