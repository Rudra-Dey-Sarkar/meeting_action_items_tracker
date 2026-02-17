import { z } from "zod";

export const ActionItemSchema = z.object({
    task: z.string(),
    description: z.string().nullable().optional(),
    owner: z.string().nullable(),
    due_date: z.string().nullable(),
});

export type ActionItemInput = z.infer<typeof ActionItemSchema>;

export interface ActionItem extends ActionItemInput {
    id: string;
    status: string;
}

