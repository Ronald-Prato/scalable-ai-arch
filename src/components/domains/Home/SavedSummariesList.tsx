/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAtom } from "jotai";
import {
  selectedSummaryAtom,
  summaryFromSavedAtom,
} from "~/states/summaryAtom";
import { Loader2 } from "lucide-react";

// Interface for summary data structure
interface Summary {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
  generatedAt: string;
  status: "PENDING" | "GENERATED" | "ERROR";
}

// Convert to client component to better control fetching
export function SavedSummariesList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [summaryToDelete, setSummaryToDelete] = useState<string | null>(null);
  const [, setSelectedSummary] = useAtom(selectedSummaryAtom);
  const [, setSummaryFromSaved] = useAtom(summaryFromSavedAtom);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the summaries list
  const refreshSummaries = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Expose the refresh function globally so it can be called from other components
  useEffect(() => {
    // @ts-ignore - Adding a custom property to window
    window.refreshSavedSummaries = refreshSummaries;

    return () => {
      // @ts-ignore - Cleanup
      delete window.refreshSavedSummaries;
    };
  }, []);

  useEffect(() => {
    // Fetch summaries when component mounts or refreshTrigger changes
    const fetchSummaries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/summary", {
          cache: "no-store",
        });

        if (!response.ok) {
          setError(true);
          return;
        }

        const summaries: Summary[] = await response.json();

        setSummaries(summaries);
      } catch (err) {
        setError(true);
        console.error("Error fetching summaries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaries();
  }, [refreshTrigger]); // Add refreshTrigger as a dependency

  const handleDeleteSummary = async (id: string) => {
    try {
      setSummaryToDelete(null); // Reset after deletion attempt
      const response = await fetch(`/api/summary?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete summary");
      }

      // Remove the deleted summary from the state
      setSummaries((prev) => prev.filter((summary) => summary.id !== id));

      toast.success("Resumen eliminado", {
        description: "El resumen ha sido eliminado correctamente.",
      });
    } catch (err) {
      console.error("Error deleting summary:", err);
      toast.error("Error", {
        description:
          "No se pudo eliminar el resumen. Intenta de nuevo más tarde.",
      });
    }
  };

  const handleSelectSummary = (summary: Summary) => {
    setSelectedSummary(summary as any);
    setSummaryFromSaved(true);
  };

  if (isLoading) {
    return (
      <div className="text-center pb-10">
        <p className="text-gray-500 dark:text-gray-400">
          Cargando resúmenes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center pb-10">
        <p className="text-gray-500 dark:text-gray-400">
          Error al cargar los resúmenes. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="text-center pb-10">
        <p className="text-gray-500 dark:text-gray-400">
          No hay resúmenes guardados todavía.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full h-[500px] pr-4">
      <div className="space-y-4">
        {summaries.map((summary) => (
          <Card
            key={summary.id}
            className={`w-full cursor-pointer transition-colors ${
              summary.status === "PENDING"
                ? "bg-yellow-50 dark:bg-yellow-950/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800"
                : summary.status === "ERROR"
                ? "bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
                : "hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            onClick={() =>
              summary.status !== "PENDING" && handleSelectSummary(summary)
            }
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardDescription className="flex flex-col">
                  <span>
                    {new Date(summary.createdAt).toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                  {summary.status === "GENERATED" && summary.generatedAt && (
                    <span className="text-xs text-muted-foreground">
                      Generado en{" "}
                      {Math.round(
                        (new Date(summary.generatedAt).getTime() -
                          new Date(summary.createdAt).getTime()) /
                          1000
                      )}{" "}
                      segundos
                    </span>
                  )}
                </CardDescription>
                {summary.status === "PENDING" && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700 flex items-center gap-1"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Pendiente
                  </Badge>
                )}
                {summary.status === "ERROR" && (
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700"
                  >
                    Error
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {summary.status === "PENDING" ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-yellow-600 dark:text-yellow-400" />
                  <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                    Generando resumen...
                  </span>
                </div>
              ) : (
                <div
                  className="line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: summary.summary }}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex gap-2">
                {/* {summary.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))} */}
              </div>
              <div className="flex gap-2">
                {summary.status !== "PENDING" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSummaryToDelete(summary.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará
                          permanentemente el resumen de la base de datos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setSummaryToDelete(null)}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            summaryToDelete &&
                            handleDeleteSummary(summaryToDelete)
                          }
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
