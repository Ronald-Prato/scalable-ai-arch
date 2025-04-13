/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { toast } from "sonner";
import { useAtom } from "jotai";
import {
  selectedSummaryAtom,
  summaryFromSavedAtom,
} from "~/states/summaryAtom";

interface SummarySectionProps {
  response: string | null;
  isLoading: boolean;
  originalText: string | null;
}

export function SummarySection({
  response,
  isLoading,
  originalText,
}: SummarySectionProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSummary, setSelectedSummary] = useAtom(selectedSummaryAtom);
  const [summaryFromSaved, setSummaryFromSaved] = useAtom(summaryFromSavedAtom);
  const [displayContent, setDisplayContent] = useState<string>("");
  const [currentOriginalText, setCurrentOriginalText] = useState<string | null>(
    null
  );

  // Parse HTML content for proper display
  const parseHtmlContent = (content: string): string => {
    // Remove ```html and ``` if present
    let cleanContent = content;
    if (content.startsWith("```html")) {
      cleanContent = content.replace(/^```html\s*/, "").replace(/\s*```$/, "");
    }

    // If content is already HTML, return it as is
    if (
      cleanContent.trim().startsWith("<") &&
      cleanContent.trim().endsWith(">")
    ) {
      return cleanContent;
    }

    // Otherwise, convert line breaks to <p> tags for better formatting
    return cleanContent
      .split("\n\n")
      .map(
        (paragraph) =>
          `<p style="font-size: 1.125rem;">${paragraph.replace(
            /\n/g,
            "<br>"
          )}</p>`
      )
      .join("");
  };

  // Update display content when response or selected summary changes
  useEffect(() => {
    if (response) {
      setDisplayContent(parseHtmlContent(response));
      setCurrentOriginalText(originalText);
      setIsSaved(false);
      setSummaryFromSaved(false);
      setSelectedSummary(null);
    } else if (selectedSummary) {
      setDisplayContent(parseHtmlContent(selectedSummary.summary));
      setCurrentOriginalText(selectedSummary.text);
      setIsSaved(true);
    } else {
      setDisplayContent("");
      setCurrentOriginalText(null);
    }
  }, [
    response,
    selectedSummary,
    originalText,
    setSelectedSummary,
    setSummaryFromSaved,
  ]);

  // Function to save the summary to the database
  const handleSave = async () => {
    if ((!response && !selectedSummary) || !currentOriginalText || isSaved)
      return;

    try {
      setIsSaving(true);

      const res = await fetch("/api/site-generation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: currentOriginalText,
          summary: displayContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save summary");
      }

      setIsSaved(true);

      toast.success("Resumen guardado", {
        description: "El resumen se ha guardado correctamente.",
      });
    } catch (error) {
      console.error("Error saving summary:", error);
      toast.error("Error", {
        description: "No se pudo guardar el resumen. Inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to clear the current summary
  const handleClear = () => {
    setSelectedSummary(null);
    setSummaryFromSaved(false);
    setDisplayContent("");
    setCurrentOriginalText(null);
    setIsSaved(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!displayContent) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Ingresa un texto para generar un resumen o selecciona uno guardado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className="prose dark:prose-invert max-w-none text-lg"
          dangerouslySetInnerHTML={{ __html: displayContent }}
          style={{ fontSize: "1.125rem" }}
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={handleSave}
            disabled={isSaved || isSaving}
            className="text-base"
          >
            {isSaving ? "Guardando..." : isSaved ? "Guardado" : "Guardar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
