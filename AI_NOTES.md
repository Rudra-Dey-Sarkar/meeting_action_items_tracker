# AI Notes

## AI Usage
- **LLM Integration**: Used Groq API with `meta-llama/llama-4-scout-17b-16e-instruct` model.
- **Code Generation**: Used AI to scaffold Next.js routes, database schema, and ShadCN components integration.
- **Prompt Engineering**: Designed a strict system prompt to ensure JSON-only output from the LLM, handling edge cases like missing owners or dates.

## Manual Checks
- **Database Schema**: Verified SQL types and constraints (UUIDs, Foreign Keys).
- **Type Safety**: Manually defined Zod schemas to validate API inputs and LLM outputs.
- **UI Logic**: Verified React state management for editing and adding items.
- **Error Handling**: Added try-catch blocks and strict parsing for LLM responses to prevent crashes on invalid JSON.

## LLM Provider
- **Provider**: Groq
- **Why**: Chosen for extremely fast inference speed (essential for interactive extraction) and compatibility with Llama models.
