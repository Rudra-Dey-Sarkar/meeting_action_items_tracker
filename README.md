# Meeting Action Items Tracker

A web application to extract and manage action items from meeting transcripts using Groq LLM.

## Live Link

- **Live Link :- `https://meeting-action-items-tracker-rds.vercel.app/`**
- **GitHub :- `https://github.com/Rudra-Dey-Sarkar/meeting_action_items_tracker`**

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Next.js Route Handlers
- **Database**: Neon PostgreSQL
- **LLM**: Groq API (meta-llama/llama-4-scout-17b-16e-instruct)

## Features

- Paste meeting transcripts and extract action items automatically.
- Create, edit, delete, and mark items as done/pending.
- View history of last 5 processed transcripts.
- Filters for filter out pending, done, all tasks and specific tasks.
- Status page checking DB and LLM health.

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd meeting_action_items_tracker
   ```
2. **Install Dependencies**

   ```bash
   npm install
   ```
3. **Configure Environment**
   Rename `.env.example` to `.env` and fill in:

   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `LLM_API_KEY`: Your Groq API Key.
4. **Initialize Database**
   Run the SQL commands in `schema.sql` in your Neon SQL Editor to create tables.
5. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

- `POST /api/transcripts`: Submit transcript.
- `GET /api/transcripts`: Get history.
- `PATCH /api/action-items/[id]`: Update item.
- `DELETE /api/action-items/[id]`: Delete item.
- `GET /api/status`: Applications status or health check.
