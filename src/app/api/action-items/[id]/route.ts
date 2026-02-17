import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { z } from "zod";

const PatchSchema = z.object({
    task: z.string().optional(),
    description: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
    due_date: z.string().nullable().optional(),
    status: z.enum(["pending", "done"]).optional(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const body = await request.json();
        const validation = PatchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.format() },
                { status: 400 }
            );
        }

        const updates = validation.data;

        const result = await sql`
      UPDATE action_items
      SET
        task = COALESCE(${updates.task}, task),
        description = COALESCE(${updates.description}, description),
        owner = COALESCE(${updates.owner}, owner),
        due_date = COALESCE(${updates.due_date}, due_date),
        status = COALESCE(${updates.status}, status)
      WHERE id = ${id}
      RETURNING *
    `;

        if (!result.length) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("PATCH Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const result = await sql`
      DELETE FROM action_items
      WHERE id = ${id}
      RETURNING id
    `;

        if (!result.length) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully", id });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
