
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ExplanationLevel, ExplanationData } from "../types";
import { PROMPTS } from "../constants";

// Helper for audio decoding
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

export const generateSpeech = async (text: string, level: ExplanationLevel): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const voiceName = level === ExplanationLevel.ELI5 ? 'Puck' : 'Kore';
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Read this explanation: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000, 1);
  
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
};

export const fetchExplanation = async (
  topic: string, 
  level: ExplanationLevel
): Promise<ExplanationData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a world-class educational communicator. 
  Explain the topic strictly at the requested level. 
  If the topic is nonsense, too vague, or potentially harmful, politely explain why in the 'definition' field and provide a neutral example. 
  Structure your JSON response to be highly engaging.`;

  const levelPrompt = PROMPTS[level];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
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

  const parsed = JSON.parse(response.text);
  return {
    ...parsed,
    topic,
    level,
    id: `${Date.now()}-${topic.replace(/\s+/g, '-').toLowerCase()}`,
    timestamp: Date.now()
  };
};
