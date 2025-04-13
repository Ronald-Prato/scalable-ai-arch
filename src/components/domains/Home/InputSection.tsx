"use client";

import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { SavedSummariesList } from "./SavedSummariesList";
import { useState } from "react";

interface InputSectionProps {
  text: string;
  setText: (text: string) => void;
  onSubmit: (option: "client" | "async") => void;
  isLoading: boolean;
}

export function InputSection({
  text,
  setText,
  onSubmit,
  isLoading,
}: InputSectionProps) {
  const [refreshKey] = useState(0);

  // Add keyboard handler for Ctrl+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isLoading) {
      e.preventDefault();
      onSubmit("client"); // Client generation on keyboard shortcut
    }
  };

  return (
    <div className="w-full flex justify-start items-start flex-col min-h-screen p-4 sm:p-8 mt-20">
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter mb-2 sm:mb-4 mt-16 2xl:mt-0">
        Resumenes
      </h1>
      <p className="mt-2 text-gray-500 text-xl sm:text-2xl dark:text-gray-400 mb-4 sm:mb-8 text-center">
        Escribe tus ideas y resúmenes aquí
      </p>

      <div className="w-full 2xl:w-3/4 sm:p-6 flex flex-col items-start">
        <Textarea
          placeholder="Escribe tu resumen aquí..."
          className="min-h-[250px] sm:min-h-[400px] max-h-[30vh] overflow-y-auto p-4 sm:p-6 text-lg sm:text-xl md:text-xl w-full flex-grow"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <Button
          onClick={() => onSubmit("client")}
          className="w-full mt-4 sm:mt-6 py-4 sm:py-6 text-base sm:text-lg"
          disabled={isLoading}
        >
          {isLoading ? "Procesando..." : "Generar desde cliente"}
        </Button>

        <Button
          onClick={() => onSubmit("async")}
          className="w-full mt-2 py-4 sm:py-6 text-base sm:text-lg"
          disabled={isLoading}
          variant="secondary"
        >
          {isLoading ? "Procesando..." : "Generación asíncrona"}
        </Button>
      </div>

      <div className="w-full 2xl:w-3/4 sm:p-6 flex flex-col items-start mt-16">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tighter mb-2 sm:mb-4 mt-16 2xl:mt-0">
          Resumenes guardados
        </h2>

        <SavedSummariesList key={refreshKey} />
      </div>
    </div>
  );
}
