"use client";

import { ActionItem } from "@/types/action-item";
import { TranscriptInput } from "@/components/transcript-input/transcript-input";
import { ActionItemList } from "@/components/actionItem-list/actionItem-list";
import { toast } from "sonner";
import { useTranscript } from "@/context/transcript-context";
import { FullTranscript } from "@/components/full-transcript/full-transcript";
import { useState } from "react";

export default function Home() {
  const { currentTranscript, setCurrentTranscript, fetchTranscrips } = useTranscript();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Extract Transcript
  const handleTranscriptSubmit = async (transcript: string) => {
    setIsLoading(true);
    const res = await fetch("/api/transcripts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    });

    if (!res.ok) {
      toast.error("Failed to process transcript");
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    fetchTranscrips();
    setCurrentTranscript(data);
    setIsLoading(false);
    toast.success("Action items extracted");
  };

  return (
    <main className="w-full flex-1 p-4 md:p-6 overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">

        <div className="space-y-6 h-full flex flex-col">
          <TranscriptInput
            onSubmit={handleTranscriptSubmit}
            isLoading={isLoading} />
          <FullTranscript transcript={currentTranscript} />
        </div>

        <div className="h-full flex flex-col">
          {currentTranscript ? (
            <div className="flex-1 overflow-auto">
              <ActionItemList
                currentTranscript={currentTranscript}
                setCurrentTranscript={setCurrentTranscript}
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
