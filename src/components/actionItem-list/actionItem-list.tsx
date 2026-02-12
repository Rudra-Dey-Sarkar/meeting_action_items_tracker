"use client";

import { useState, useMemo } from "react";
import { ActionItem } from "@/types/action-item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import CreateNewTaskModal from "./create-new-task-modal";
import Filters from "./filters";

interface Props {
    items: ActionItem[];
    onAdd: (data: Partial<ActionItem>) => void;
    onUpdate: (id: string, data: Partial<ActionItem>) => void;
    onDelete: (id: string) => void;
}

export interface FormValues {
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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<FormValues | null>(null);
    const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
    const [dateFilter, setDateFilter] = useState<string>("");

    /* filter */
    const normalize = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const statusMatch =
                filter === "all" ? true : item.status === filter;

            const dateMatch = dateFilter
                ? item.due_date && normalize(item.due_date) === dateFilter
                : true;

            return statusMatch && dateMatch;
        });
    }, [items, filter, dateFilter]);


    return (
        <div className="space-y-6">

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <Filters
                    filter={filter}
                    setFilter={setFilter}
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                />

                <CreateNewTaskModal onAdd={onAdd} />
            </div>

            {/* Items */}
            <div className="space-y-3">

                {filteredItems.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center p-6 border rounded-lg">
                        No matching tasks.
                    </div>
                )}

                {filteredItems.map((item) => {
                    const isEditing = editingId === item.id;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3"
                        >
                            {/* Left */}
                            <div className="flex-1 space-y-2">
                                {isEditing ? (
                                    <>
                                        <Input
                                            value={editValues?.task || ""}
                                            onChange={(e) =>
                                                setEditValues({
                                                    ...editValues!,
                                                    task: e.target.value,
                                                })
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

                            {/* Right */}
                            <div className="flex gap-2 flex-wrap">

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
                                            className="cursor-pointer"
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
                                            className="cursor-pointer"
                                            onClick={() => {
                                                setEditingId(item.id);
                                                setEditValues({
                                                    task: item.task,
                                                    owner: item.owner || "",
                                                    due_date:
                                                        item.due_date?.split("T")[0] || "",
                                                });
                                            }}
                                        >
                                            <Pencil size={16} />
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="cursor-pointer"
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
