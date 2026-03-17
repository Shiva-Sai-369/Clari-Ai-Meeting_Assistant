import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TranscriptionSegment } from "../../backend/services/freeSpeechToTextService";

export interface MeetingSummary {
  summary: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  keyDecisions: string[];
}

function buildTranscriptText(segments: TranscriptionSegment[]): string {
  return segments
    .filter((s) => s.isFinal)
    .map((s) => `${s.speaker}: ${s.text}`)
    .join("\n");
}

const PROMPT_TEMPLATE = `You are an AI meeting assistant. Analyze the following meeting transcript and return a JSON object with exactly this structure:
{
  "summary": ["key point 1", "key point 2", ...],
  "actionItems": [
    { "task": "description", "owner": "person or Unknown", "deadline": "timeframe or TBD" },
    ...
  ],
  "keyDecisions": ["decision 1", "decision 2", ...]
}

Rules:
- summary: 3–6 concise bullet points covering the main topics discussed
- actionItems: concrete tasks with an owner name if mentioned, otherwise "Unknown", and a deadline if mentioned, otherwise "TBD"
- keyDecisions: any decisions, agreements, or conclusions reached (can be empty array if none)
- Return ONLY valid JSON, no markdown fences, no extra text

Transcript:
`;

export async function generateMeetingSummary(
  segments: TranscriptionSegment[]
): Promise<MeetingSummary> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set in your .env.local file.");
  }

  const transcript = buildTranscriptText(segments);
  if (!transcript.trim()) {
    throw new Error("No finalized transcript segments to summarize.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(PROMPT_TEMPLATE + transcript);
  const text = result.response.text().trim();

  let parsed: MeetingSummary;
  try {
    parsed = JSON.parse(text) as MeetingSummary;
  } catch {
    // Gemini occasionally wraps JSON in markdown fences — strip and retry
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[1].trim()) as MeetingSummary;
    } else {
      throw new Error("Gemini returned an unexpected response format.");
    }
  }

  return parsed;
}
