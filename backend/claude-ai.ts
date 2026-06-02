import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Analyze document using Claude 3.5 Sonnet
 * Better performance than GPT-4 for OHSE use cases
 */
export async function analyzeDocumentWithClaude(
  documentContent: string,
  documentType: string = "safety"
): Promise<string> {
  try {
    const prompt = `You are an expert OHSE (Occupational Health, Safety and Environment) consultant. 
    
Document Type: ${documentType}
Document Content:
${documentContent.substring(0, 8000)}

Please provide:
1. Key safety risks and hazards identified
2. Compliance requirements (COIDA, NBRH, CIDB)
3. Recommended corrective actions
4. Risk severity assessment (High/Medium/Low)
5. Implementation timeline

Format as structured JSON with sections for risks, compliance, and actions.`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude API");
  } catch (error) {
    console.error("Claude AI analysis error:", error);
    throw error;
  }
}

/**
 * Get safety recommendations using Claude
 */
export async function getSafetyRecommendations(
  riskDescription: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `As an OHSE expert, provide specific, actionable safety recommendations for: ${riskDescription}`,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude API");
  } catch (error) {
    console.error("Claude recommendations error:", error);
    throw error;
  }
}

/**
 * Generate compliance report using Claude
 */
export async function generateComplianceReport(
  companyData: string,
  regulatoryStandard: string = "COIDA"
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Generate a compliance assessment report for ${regulatoryStandard} based on: ${companyData.substring(0, 4000)}`,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      return response.text;
    }

    throw new Error("Unexpected response type from Claude API");
  } catch (error) {
    console.error("Claude compliance report error:", error);
    throw error;
  }
}
