# Prompts Used

## Application Prompt (System Prompt for Extraction)
used in \`src/lib/llm.ts\`:

\`\`\`text
You are an expert project manager. extract action items from the following meeting transcript.

Strictly return a JSON array of objects with the following structure:
[
  {
    "task": "string description of the task",
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
\`\`\`

## Development Prompts
- "Create a Next.js 15 app with Tailwind and ShadCN"
- "Create a PostgreSQL schema for transcripts and action items"
- "Write a Next.js API route to handle Groq API requests and database transactions"
