import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { z } from "zod";

const CreateItemSchema = z.object({
    transcript_id: z.string().uuid(),
    task: z.string().min(1),
    description: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = CreateItemSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { transcript_id, task,description, owner, due_date } = validation.data;

        const result = await sql`
      INSERT INTO action_items (transcript_id, task, description, owner, due_date, status)
      VALUES (${transcript_id}, ${task}, ${description ?? null}, ${owner ?? null}, ${due_date ?? null}, 'pending')
      RETURNING *
    `;

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("POST /api/action-items Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
