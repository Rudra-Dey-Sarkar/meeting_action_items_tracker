import { ActionItemInput, ActionItemSchema } from "@/types/action-item";
import { z } from "zod";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function extractActionItems(transcript: string): Promise<ActionItemInput[]> {
    if (!process.env.LLM_API_KEY) {
        throw new Error("LLM_API_KEY is not defined");
    }

    const prompt = `
You are an expert project manager. extract action items from the following meeting transcript.

Strictly return a JSON array of objects with the following structure:
[
  {
    "task": "string description of the task",
    "description": "1-2 line short summary of what needs to be done",
    "owner": "string name of the person responsible or null if not found",
    "due_date": "YYYY-MM-DD date string or null if not found"
  }
]

Rules:
- JSON only.
- No explanation text.
- No markdown code blocks.
- Use ISO date format (YYYY-MM-DD).
- Use null if owner or due_date are not found.
- If no action items are found, return an empty array [].

Transcript:
${transcript}
`;

    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.LLM_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: [{ role: "user", content: prompt }],
                temperature: 0,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || "[]";

        // Strip markdown code blocks if present
        const jsonString = content.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

        let parsedData;
        try {
            parsedData = JSON.parse(jsonString);
        } catch (error) {
            console.error("Failed to parse LLM JSON:", content, error);
            throw new Error("LLM returned invalid JSON");
        }

        // Validate with Zod
        const ResultSchema = z.array(ActionItemSchema);
        const validation = ResultSchema.safeParse(parsedData);

        if (!validation.success) {
            console.error("Zod Validation Error:", validation.error);
            throw new Error("LLM response structure invalid");
        }

        return validation.data;
    } catch (error) {
        console.error("Error extracting action items:", error);
        throw error;
    }
}
