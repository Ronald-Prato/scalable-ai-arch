import { Summary } from "@prisma/client";
import { atom } from "jotai";

export interface ProcessedSummary {
  id: string;
  title: string;
  content: string;
  date: string;
  originalText: string;
  tags: string[];
}

// Atom to store the currently selected summary
export const selectedSummaryAtom = atom<Summary | null>(null);

// Atom to track if the summary was loaded from saved summaries
export const summaryFromSavedAtom = atom<boolean>(false);
