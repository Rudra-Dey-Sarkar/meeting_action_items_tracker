"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { ActionItem } from "@/types/action-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";

interface Props {
    items: ActionItem[];
    onAdd: (data: Partial<ActionItem>) => void;
    onUpdate: (id: string, data: Partial<ActionItem>) => void;
    onDelete: (id: string) => void;
}

interface FormValues {
    task: string;
    owner?: string;
    due_date?: string;
}

export function ActionItemList({
    items,
    onAdd,
    onUpdate,
    onDelete,
}: Props) {
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<FormValues | null>(null);

    return (
        <div className="space-y-6">

            {/* Add Form */}
            <form
                onSubmit={handleSubmit((data) => {
                    onAdd(data);
                    reset();
                })}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
                <Input {...register("task", { required: true })} placeholder="Task" />
                <Input {...register("owner")} placeholder="Owner" />
                <Input {...register("due_date")} type="date" />
                <Button type="submit" className="sm:col-span-3">
                    Add Item
                </Button>
            </form>

            {/* Items */}
            <div className="space-y-3">
                {items.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center p-6 border rounded-lg">
                        No action items yet.
                    </div>
                )}

                {items.map((item) => {
                    const isEditing = editingId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                        >
                            {/* Left Content */}
                            <div className="flex-1 space-y-2">
                                {isEditing ? (
                                    <>
                                        <Input
                                            value={editValues?.task || ""}
                                            onChange={(e) =>
                                                setEditValues({ ...editValues!, task: e.target.value })
                                            }
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <Input
                                                value={editValues?.owner || ""}
                                                placeholder="Owner"
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues!,
                                                        owner: e.target.value,
                                                    })
                                                }
                                            />
                                            <Input
                                                type="date"
                                                value={editValues?.due_date || ""}
                                                onChange={(e) =>
                                                    setEditValues({
                                                        ...editValues!,
                                                        due_date: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p
                                            className={`font-medium ${item.status === "done"
                                                    ? "line-through text-muted-foreground"
                                                    : ""
                                                }`}
                                        >
                                            {item.task}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.owner || "-"} |{" "}
                                            {item.due_date
                                                ? new Date(item.due_date).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Right Buttons */}
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                onUpdate(item.id, editValues!);
                                                setEditingId(null);
                                            }}
                                        >
                                            <Check size={16} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingId(null)}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                onUpdate(item.id, {
                                                    status:
                                                        item.status === "done"
                                                            ? "pending"
                                                            : "done",
                                                })
                                            }
                                        >
                                            {item.status === "done" ? "Undo" : "Done"}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingId(item.id);
                                                setEditValues({
                                                    task: item.task,
                                                    owner: item.owner || "",
                                                    due_date: item.due_date?.split("T")[0] || "",
                                                });
                                            }}
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
