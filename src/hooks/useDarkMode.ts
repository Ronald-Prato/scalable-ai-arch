import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useDarkMode() {
  // Estado para controlar si el componente está montado
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useLocalStorage<boolean>("theme", true);

  // Este efecto se ejecuta en el lado del cliente cuando cambia isDark
  useEffect(() => {
    if (!mounted) return;

    // Limpiar clases primero para evitar conflictos
    document.documentElement.classList.remove("dark");

    // Aplicar el tema según el estado almacenado
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, [isDark, mounted]);

  // Este efecto se ejecuta una sola vez al montar el componente
  useEffect(() => {
    // Marcar que el componente está montado
    setMounted(true);

    // Aplicar tema inicial basado en localStorage
    const savedTheme = localStorage.getItem("theme");
    const initialIsDark = savedTheme !== null ? JSON.parse(savedTheme) : true;

    if (initialIsDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Si el valor en localStorage es diferente al estado inicial, actualizar el estado
    if (initialIsDark !== isDark) {
      setIsDark(initialIsDark);
    }

    return () => setMounted(false);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return {
    isDark,
    toggleTheme,
    // Devolver mounted para que los componentes puedan evitar parpadeos
    mounted,
  };
}
