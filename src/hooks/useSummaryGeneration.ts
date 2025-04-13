import { useState } from "react";
import { toast } from "sonner";

interface UseSummaryGenerationProps {
  text: string;
  onSuccess?: (saveToDatabase?: boolean) => void;
}

export function useSummaryGeneration({
  text,
  onSuccess,
}: UseSummaryGenerationProps) {
  const [clientLoading, setClientLoading] = useState(false);
  const [asyncLoading, setAsyncLoading] = useState(false);

  // Function to handle client-side generation
  const handleClientGeneration = async () => {
    try {
      setClientLoading(true);
      const response = await fetch("/api/site-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          summaryId: "temp-" + Date.now(), // This will be ignored if not needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Resumen generado correctamente", {
          description: "El resumen se ha generado desde el cliente",
        });
        onSuccess?.(true); // Call the parent onSubmit to handle the response
      } else {
        toast.error("Error al generar el resumen", {
          description: data.error || "Ocurrió un error inesperado",
        });
      }
    } catch (error) {
      console.error("Client Generation Error:", error);
      toast.error("Error al generar el resumen desde el cliente");
    } finally {
      setClientLoading(false);
    }
  };

  // Function to handle async generation
  const handleAsyncGeneration = async () => {
    try {
      setAsyncLoading(true);
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      });

      const data = await response.json();

      if (data.saved) {
        toast.success("Resumen enviado para procesamiento asíncrono", {
          description: `ID: ${data.summaryId}`,
        });
      } else {
        toast.error("Error al enviar el resumen", {
          description: data.error || "Ocurrió un error inesperado",
        });
      }
    } catch (error) {
      console.error("Async Generation Error:", error);
      toast.error("Error al enviar el resumen para procesamiento asíncrono");
    } finally {
      setAsyncLoading(false);
    }
  };

  // Check if any generation process is loading
  const isLoading = clientLoading || asyncLoading;

  return {
    clientLoading,
    asyncLoading,
    isLoading,
    handleClientGeneration,
    handleAsyncGeneration,
  };
}
