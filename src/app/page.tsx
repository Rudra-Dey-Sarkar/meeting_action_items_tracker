"use client";

import { useState } from "react";
import { Transcript } from "@/lib/types";
import { TranscriptInput } from "@/components/TranscriptInput";
import { ActionItemList } from "@/components/ActionItemList";
import { HistorySidebar } from "@/components/HistorySidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  const [currentTranscript, setCurrentTranscript] = useState<Transcript | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleTranscriptProcessed = (data: Transcript) => {
    setCurrentTranscript(data);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSelectHistory = (transcript: Transcript) => {
    setCurrentTranscript(transcript);
  };

  const handleItemsRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <HistorySidebar
        onSelect={handleSelectHistory}
        refreshTrigger={refreshTrigger}
      />

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Meeting Action Items Tracker
          </h1>
          <p className="text-muted-foreground">
            Extract and manage tasks from your meeting transcripts.
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
          <div className="flex flex-col space-y-4 overflow-y-auto pr-2">
            <TranscriptInput onSuccess={handleTranscriptProcessed} />

            {currentTranscript && (
              <div className="mt-6 p-4 border rounded-md bg-muted/20">
                <h3 className="font-semibold mb-2">Transcript Content</h3>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {currentTranscript.content}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col overflow-y-auto pl-2">
            {currentTranscript ? (
              <ActionItemList
                items={currentTranscript.action_items ?? []}
                transcriptId={currentTranscript.id}
                onRefresh={handleItemsRefresh}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg">
                Select a transcript or extract items from a new one.
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
