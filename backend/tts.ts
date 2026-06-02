import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import path from "path";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

/**
 * Convert text to speech using ElevenLabs
 */
export async function textToSpeech(
  text: string,
  voiceId: string = "21m00Tcm4TlvDq8ikWAM",
  outputPath?: string
): Promise<Buffer> {
  try {
    const audio = await client.generate({
      voice_id: voiceId,
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    });

    // Convert to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Save to file if path provided
    if (outputPath) {
      fs.writeFileSync(outputPath, audioBuffer);
    }

    return audioBuffer;
  } catch (error) {
    console.error("Text-to-speech error:", error);
    throw error;
  }
}

/**
 * Generate safety training audio
 */
export async function generateTrainingAudio(
  trainingContent: string,
  trainingTitle: string,
  outputDir: string = "./training-audio"
): Promise<string> {
  try {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const sanitizedTitle = trainingTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const outputPath = path.join(outputDir, `${sanitizedTitle}.mp3`);

    // Split content into chunks if too long (ElevenLabs has limits)
    const maxChunkLength = 3000;
    const chunks = trainingContent.match(new RegExp(`.{1,${maxChunkLength}}`, "g")) || [];

    let fullAudio = Buffer.alloc(0);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkAudio = await textToSpeech(chunk, "", undefined);
      fullAudio = Buffer.concat([fullAudio, chunkAudio]);
    }

    fs.writeFileSync(outputPath, fullAudio);
    return outputPath;
  } catch (error) {
    console.error("Training audio generation error:", error);
    throw error;
  }
}

/**
 * Generate incident response audio alert
 */
export async function generateIncidentAlert(
  incidentType: string,
  severity: string,
  location: string
): Promise<Buffer> {
  try {
    const alertText = `ATTENTION! Safety incident alert. Type: ${incidentType}. Severity: ${severity}. Location: ${location}. Please stand by for further instructions.`;

    const audio = await textToSpeech(alertText, "21m00Tcm4TlvDq8ikWAM", undefined);
    return audio;
  } catch (error) {
    console.error("Incident alert generation error:", error);
    throw error;
  }
}

/**
 * Generate compliance announcement audio
 */
export async function generateComplianceAnnouncement(
  complianceItem: string,
  deadline: string
): Promise<Buffer> {
  try {
    const announcement = `Compliance notice. Action required: ${complianceItem}. Deadline: ${deadline}. Please log into K2020 OHSE for more details.`;

    const audio = await textToSpeech(announcement, "21m00Tcm4TlvDq8ikWAM", undefined);
    return audio;
  } catch (error) {
    console.error("Compliance announcement error:", error);
    throw error;
  }
}

/**
 * Get available voices
 */
export async function getAvailableVoices(): Promise<any[]> {
  try {
    const voices = await client.voices.getAll();
    return voices;
  } catch (error) {
    console.error("Get voices error:", error);
    throw error;
  }
}

/**
 * Create custom voice (Instant Voice Clone)
 */
export async function createCustomVoice(
  voiceName: string,
  sampleAudioPath: string,
  description?: string
): Promise<string> {
  try {
    const audioBuffer = fs.readFileSync(sampleAudioPath);

    const voice = await client.voices.create({
      name: voiceName,
      files: [
        new File([audioBuffer], path.basename(sampleAudioPath), {
          type: "audio/mpeg",
        }),
      ],
      description: description || `Custom voice: ${voiceName}`,
    });

    return voice.voice_id;
  } catch (error) {
    console.error("Custom voice creation error:", error);
    throw error;
  }
}
