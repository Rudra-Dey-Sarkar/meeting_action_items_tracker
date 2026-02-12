"use client";

import { createContext, useContext, useState } from "react";
import { Transcript } from "@/types/transcript";

interface TranscriptContextType {
  currentTranscript: Transcript | null;
  setCurrentTranscript: (t: Transcript | null) => void;
}

const TranscriptContext = createContext<TranscriptContextType | undefined>(
  undefined
);

export function TranscriptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTranscript, setCurrentTranscript] =
    useState<Transcript | null>(null);

  return (
    <TranscriptContext.Provider
      value={{ currentTranscript, setCurrentTranscript }}
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
