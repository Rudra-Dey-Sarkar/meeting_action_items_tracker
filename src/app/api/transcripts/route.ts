import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { extractActionItems } from "@/lib/llm";
import { z } from "zod";

const PostSchema = z.object({
    transcript: z.string().min(1, "Transcript cannot be empty"),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = PostSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { transcript } = validation.data;

        // 1 Extract from LLM
        const actionItemsData = await extractActionItems(transcript);
        
        // 2 Transaction
        await sql`BEGIN`;

        try {
            const transcriptRes = await sql`
        INSERT INTO transcripts (content)
        VALUES (${transcript})
        RETURNING id, created_at
      `;

            const transcriptId = transcriptRes[0].id;
            const createdAt = transcriptRes[0].created_at;

            const insertedItems = [];

            for (const item of actionItemsData) {
                const itemRes = await sql`
          INSERT INTO action_items (transcript_id, task, description, owner, due_date, status)
          VALUES (${transcriptId}, ${item.task}, ${item.description ?? null}, ${item.owner}, ${item.due_date}, 'pending')
          RETURNING *
        `;
                insertedItems.push(itemRes[0]);
            }

            await sql`COMMIT`;

            return NextResponse.json({
                id: transcriptId,
                content: transcript,
                created_at: createdAt,
                action_items: insertedItems,
            });
        } catch (error) {
            await sql`ROLLBACK`;
            throw error;
        }
    } catch (error) {
        console.error("POST /api/transcripts Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const transcripts = await sql`
      SELECT id, content, created_at
      FROM transcripts
      ORDER BY created_at DESC
      LIMIT 5
    `;

        const result = [];

        for (const t of transcripts) {
            const items = await sql`
        SELECT *
        FROM action_items
        WHERE transcript_id = ${t.id}
        ORDER BY created_at ASC
      `;

            result.push({
                ...t,
                action_items: items,
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("GET /api/transcripts Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
