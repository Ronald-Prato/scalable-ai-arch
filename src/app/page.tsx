"use client";

import { useState } from "react";
import { Switch } from "~/components/ui/switch";
import { useDarkMode } from "~/hooks/useDarkMode";
import { InputSection } from "~/components/domains/Home/InputSection";
import { SummarySection } from "~/components/domains/Home/SummarySection";
import { Toaster } from "~/components/ui/sonner";
import { toast } from "sonner";

export default function Home() {
  const { isDark, toggleTheme } = useDarkMode();
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (option: "client" | "async") => {
    if (!text.trim()) {
      toast.error("Por favor ingresa algún texto para resumir");
      return;
    }

    try {
      setIsLoading(true);

      // Determine which endpoint to call based on the processing type
      const endpoint =
        option === "client" ? "/api/site-generation" : "/api/summary";

      const requestBody = { text };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error en el servidor");
      }

      // Handle different response formats based on the endpoint
      if (data.summaryId) {
        toast.success(
          option === "client"
            ? "Resumen generado correctamente"
            : "Resumen en cola para procesamiento"
        );
      }

      if (option === "client") {
        setResponse(data.summary || "");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Ocurrió un error al procesar tu solicitud.");
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 w-full">
      {/* Theme switch in the top left corner */}
      <div className="absolute left-4 sm:left-8 top-4 sm:top-8 flex items-center gap-2">
        <Switch checked={isDark} onCheckedChange={toggleTheme} />
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {isDark ? "Modo oscuro" : "Modo claro"}
        </span>
      </div>

      {/* Responsive layout: columns on large desktop (>1580px), rows on mobile and tablet */}
      <div className="w-full overflow-y-auto grid grid-cols-1 2xl:grid-cols-2">
        {/* Left column - Input */}
        <InputSection
          text={text}
          setText={setText}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />

        {/* Right column - Summary */}
        <SummarySection
          response={response}
          isLoading={isLoading}
          originalText={text}
        />
      </div>

      {/* Add Toaster component for notifications */}
      <Toaster />
    </main>
  );
}
