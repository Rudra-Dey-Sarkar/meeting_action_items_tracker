"use client";

import { Transcript } from "@/types/transcript";
import { Separator } from "../ui/separator";

interface Props {
    transcript: Transcript | null;
}

export function FullTranscript({ transcript }: Props) {
    if (!transcript) return null;

    return (
        <div className="border rounded-lg p-4 bg-muted/20 max-h-64 overflow-auto">
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                Full Transcript
            </h3>
            <Separator />

            <p className="whitespace-pre-wrap text-sm leading-relaxed mt-2">
                {transcript.content}
            </p>
        </div>
    );
}
