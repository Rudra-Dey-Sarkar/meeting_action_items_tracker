"use client";

import { useState } from "react";
import { ActionItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox"; // Unused
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Check, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ActionItemListProps {
    items: ActionItem[];
    transcriptId?: string;
    onRefresh: () => void;
}

type ActionItemForm = {
    task?: string;
    owner?: string | null;
    due_date?: string | null;
    status?: "pending" | "done";
};

export function ActionItemList({ items, transcriptId, onRefresh }: ActionItemListProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ActionItemForm>({});
    const [newForm, setNewForm] = useState<ActionItemForm>({});
    const [isAdding, setIsAdding] = useState(false);

    const handleEditClick = (item: ActionItem) => {
        setEditingId(item.id);
        setEditForm({
            task: item.task,
            owner: item.owner || "",
            due_date: item.due_date ? item.due_date.split('T')[0] : "",
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/action-items/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Item updated");
            setEditingId(null);
            onRefresh();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/action-items/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Item deleted");
            onRefresh();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleStatusToggle = async (item: ActionItem) => {
        const newStatus = item.status === "done" ? "pending" : "done";
        try {
            const res = await fetch(`/api/action-items/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");
            onRefresh();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleAddSubmit = async () => {
        if (!transcriptId) return;
        try {
            const res = await fetch("/api/action-items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...newForm, transcript_id: transcriptId }),
            });
            if (!res.ok) throw new Error("Failed to add");
            toast.success("Item added");
            setIsAdding(false);
            setNewForm({});
            onRefresh();
        } catch (error) {
            toast.error("Add failed");
        }
    };

    if (!items) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Action Items</h2>
                {transcriptId && !isAdding && (
                    <Button size="sm" onClick={() => setIsAdding(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                )}
            </div>

            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Status</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead className="w-[150px]">Owner</TableHead>
                            <TableHead className="w-[150px]">Due Date</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isAdding && (
                            <TableRow className="bg-muted/50">
                                <TableCell></TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="Task description"
                                        value={newForm.task || ""}
                                        onChange={e => setNewForm({ ...newForm, task: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        placeholder="Owner"
                                        value={newForm.owner || ""}
                                        onChange={e => setNewForm({ ...newForm, owner: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        type="date"
                                        value={newForm.due_date || ""}
                                        onChange={e => setNewForm({ ...newForm, due_date: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" onClick={handleAddSubmit}><Check className="w-4 h-4" /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}><X className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {items.map((item) => (
                            <TableRow key={item.id} className={item.status === 'done' ? 'bg-muted/30' : ''}>
                                <TableCell>
                                    <Button variant="ghost" size="sm" onClick={() => handleStatusToggle(item)}>
                                        {item.status === "done" ? <Check className="text-green-500" /> : <div className="w-4 h-4 border rounded-sm" />}
                                    </Button>
                                </TableCell>

                                {editingId === item.id ? (
                                    <>
                                        <TableCell>
                                            <Input
                                                value={editForm.task || ""}
                                                onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                value={editForm.owner || ""}
                                                onChange={(e) => setEditForm({ ...editForm, owner: e.target.value })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="date"
                                                value={editForm.due_date || ""}
                                                onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button size="icon" variant="ghost" onClick={() => handleSaveEdit(item.id)}>
                                                    <Check className="w-4 h-4 text-green-500" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                                                    <X className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell className={item.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                                            {item.task}
                                        </TableCell>
                                        <TableCell>
                                            {item.owner ? <Badge variant="outline">{item.owner}</Badge> : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {item.due_date ? new Date(item.due_date).toLocaleDateString() : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-1">
                                                <Button size="icon" variant="ghost" onClick={() => handleEditClick(item)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                        {items.length === 0 && !isAdding && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                    No action items found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
