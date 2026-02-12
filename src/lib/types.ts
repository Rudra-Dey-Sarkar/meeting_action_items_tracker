import { z } from "zod";

export const ActionItemSchema = z.object({
    task: z.string(),
    owner: z.string().nullable(),
    due_date: z.string().nullable(), // ISO date string or null
});

export type ActionItemInput = z.infer<typeof ActionItemSchema>;

export interface ActionItem extends ActionItemInput {
    id: string;
    status: string; // "pending" | "done"
}

export interface Transcript {
    id: string;
    content: string;
    created_at: string; // ISO string
    action_items?: ActionItem[];
}
