import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    const status = {
        app: "running",
        db: "unknown",
        llm: "unknown",
        timestamp: new Date().toISOString(),
    };

    try {
        await sql`SELECT 1`;
        status.db = "connected";
    } catch (error) {
        console.error("DB Health Check Failed:", error);
        status.db = "disconnected";
    }

    status.llm = process.env.LLM_API_KEY ? "configured" : "missing_key";

    return NextResponse.json(status);
}
