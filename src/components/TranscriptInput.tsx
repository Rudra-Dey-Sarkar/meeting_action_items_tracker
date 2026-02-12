"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Transcript } from "@/lib/types";

interface TranscriptInputProps {
  onSuccess: (data: Transcript) => void;
}

export function TranscriptInput({ onSuccess }: TranscriptInputProps) {
    const [transcript, setTranscript] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!transcript.trim()) {
            toast.error("Please enter a transcript");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/transcripts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            });

            if (!res.ok) {
                throw new Error("Failed to process transcript");
            }

            const data = await res.json();
            toast.success("Action items extracted successfully!");
            setTranscript("");
            onSuccess(data);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h2 className="text-lg font-semibold">New Transcript</h2>
            <Textarea
                placeholder="Paste meeting transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px]"
            />
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Extracting Action Items...
                    </>
                ) : (
                    "Extract Action Items"
                )}
            </Button>
        </div>
    );
}
