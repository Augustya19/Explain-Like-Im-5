import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ExplanationLevel, ExplanationData } from "../types";
import { PROMPTS } from "../constants";

/* ===============================
   Shared Gemini Client
================================ */

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

/* ===============================
   Helpers for Audio
================================ */

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/* ===============================
   Text-to-Speech (Guarded)
================================ */

export const generateSpeech = async (
  text: string,
  level: ExplanationLevel
): Promise<void> => {
  try {
    const voiceName = level === ExplanationLevel.ELI5 ? "Puck" : "Kore";

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: `Read this explanation aloud: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      console.warn("No audio returned by Gemini");
      return;
    }

    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const audioBuffer = await decodeAudioData(
      decodeBase64(base64Audio),
      audioCtx,
      24000,
      1
    );

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (err) {
    console.error("Gemini TTS failed:", err);
  }
};

/* ===============================
   Explanation Generator
================================ */

export const fetchExplanation = async (
  topic: string,
  level: ExplanationLevel
): Promise<ExplanationData> => {
  try {
    const systemInstruction = `
You are a world-class educational communicator.
Explain the topic strictly at the requested level.
If the topic is vague, nonsense, or unsafe, explain why politely.
Return ONLY valid JSON following the schema.
    `.trim();

    const levelPrompt = PROMPTS[level];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `${levelPrompt} The topic is: "${topic}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: { type: Type.STRING },
            analogy: { type: Type.STRING },
            example: { type: Type.STRING },
            takeaway: { type: Type.STRING },
          },
          required: ["definition", "analogy", "example", "takeaway"],
        },
      },
    });

    const parsed = JSON.parse(response.text());

    return {
      ...parsed,
      topic,
      level,
      id: `${Date.now()}-${topic.replace(/\s+/g, "-").toLowerCase()}`,
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error("Gemini explanation failed:", err);
    throw new Error("Failed to generate explanation");
  }
};
