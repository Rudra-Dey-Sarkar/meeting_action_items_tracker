"use client";

import { useEffect, useState } from "react";
import { Transcript } from "@/types/transcript";
import { ActionItem } from "@/types/action-item";
import { TranscriptInput } from "@/components/transcript-input";
import { ActionItemList } from "@/components/actionItem-list";
import { toast } from "sonner";
import { useTranscript } from "@/context/transcript-context";

export default function Home() {
  const { currentTranscript, setCurrentTranscript } = useTranscript();

  // Extract Transcript
  const handleTranscriptSubmit = async (transcript: string) => {
    const res = await fetch("/api/transcripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (!res.ok) {
      toast.error("Failed to process transcript");
      return;
    }

    const data = await res.json();
    setCurrentTranscript(data);
    toast.success("Action items extracted");
  };

  // Add Action Item
  const addActionItem = async (form: Partial<ActionItem>) => {
    if (!currentTranscript) return;

    const res = await fetch("/api/action-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        transcript_id: currentTranscript.id,
      }),
    });

    if (!res.ok) return toast.error("Failed to add task");

    const newItem = await res.json();

    setCurrentTranscript({
      ...currentTranscript,
      action_items: [...(currentTranscript.action_items ?? []), newItem],
    });
    toast.success("Task added successfully");
  };

  // Update Item
  const updateItem = async (id: string, data: Partial<ActionItem>) => {
    const res = await fetch(`/api/action-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) return toast.error("Failed to update task");

    const updated = await res.json();

    if (!currentTranscript) return;

    setCurrentTranscript({
      ...currentTranscript,
      action_items: currentTranscript.action_items?.map((item) =>
        item.id === id ? updated : item
      ),
    });
    toast.success("Task updated successfully");
  };

  // Delete Item
  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/action-items/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return toast.error("Delete failed");

    if (!currentTranscript) return;

    setCurrentTranscript({
      ...currentTranscript,
      action_items: currentTranscript.action_items?.filter(
        (item) => item.id !== id
      ),
    });

    toast.warning("Task deleted successfully");
  };

  return (
    <main className="w-full flex-1 p-4 md:p-6 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">

        <div className="space-y-6 h-full flex flex-col">
          <TranscriptInput onSubmit={handleTranscriptSubmit} />
        </div>

        <div className="h-full flex flex-col">
          {currentTranscript ? (
            <div className="flex-1 overflow-auto">
              <ActionItemList
                items={currentTranscript.action_items ?? []}
                onAdd={addActionItem}
                onUpdate={updateItem}
                onDelete={deleteItem}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border rounded-lg text-muted-foreground text-sm p-6">
              Select a transcript or extract a new one.
            </div>
          )}
        </div>


      </div>
    </main>
  );
}
