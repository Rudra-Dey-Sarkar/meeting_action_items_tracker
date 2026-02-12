"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Transcript } from "@/types/transcript";

interface TranscriptContextType {
  currentTranscript: Transcript | null;
  setCurrentTranscript: (t: Transcript | null) => void;
  isHistoryLoading: boolean;
  history: Transcript[];
  fetchTranscrips: () => Promise<void>;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(
  undefined
);

export function TranscriptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTranscript, setCurrentTranscript] = useState<Transcript | null>(null);
  const [history, setHistory] = useState<Transcript[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);

  const fetchTranscrips = async () => {
    const res = await fetch("/api/transcripts");
    if (res.ok) {
      const data = await res.json();
      setHistory(data);
    }

    setIsHistoryLoading(false);
  }

  useEffect(() => {
    fetchTranscrips();
  }, []);

  return (
    <TranscriptContext.Provider
      value={{ currentTranscript, setCurrentTranscript, isHistoryLoading, history, fetchTranscrips }}
    >
      {children}
    </TranscriptContext.Provider>
  );
}

export function useTranscript() {
  const context = useContext(TranscriptContext);
  if (!context)
    throw new Error("useTranscript must be used inside TranscriptProvider");
  return context;
}
