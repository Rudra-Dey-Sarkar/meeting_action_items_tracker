import { ActionItem } from "./action-item";

export interface Transcript {
    id: string;
    content: string;
    created_at: string;
    action_items?: ActionItem[];
}
