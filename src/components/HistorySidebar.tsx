"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area"; // Need to install? ShadCN scroll-area. I didn't install it. I'll use standard div overflow.
import { Loader2 } from "lucide-react";

import { Transcript } from "@/lib/types";

interface HistorySidebarProps {
    onSelect: (transcript: Transcript) => void;
    refreshTrigger: number; // Increment to force refresh
}

export function HistorySidebar({ onSelect, refreshTrigger }: HistorySidebarProps) {
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/transcripts");
            if (res.ok) {
                const data = await res.json();
                setTranscripts(data);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-64 border-r bg-muted/10 h-full p-4 flex flex-col">
            <h3 className="font-semibold mb-4">Recent Transcripts</h3>
            {loading ? (
                <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="space-y-2 overflow-y-auto flex-1">
                    {transcripts.length === 0 && <div className="text-sm text-muted-foreground">No history yet.</div>}
                    {transcripts.map((t) => (
                        <Button
                            key={t.id}
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2 px-2"
                            onClick={() => onSelect(t)}
                        >
                            <div className="flex flex-col truncate">
                                <span className="truncate w-full font-medium text-xs">{t.content.substring(0, 30)}...</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(t.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
