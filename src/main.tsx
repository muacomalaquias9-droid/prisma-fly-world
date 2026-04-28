import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ====== Proteção em produção ======
if (import.meta.env.PROD) {
  // Desativar console
  const noop = () => {};
  ["log", "warn", "info", "debug", "trace", "table", "dir"].forEach((m) => {
    // @ts-ignore
    console[m] = noop;
  });

  // Bloquear menu contexto
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Bloquear atalhos de devtools comuns
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U") ||
      (e.metaKey && e.altKey && ["I", "J", "C"].includes(e.key))
    ) {
      e.preventDefault();
    }
  });

  // Bloquear seleção/drag de imagens (já feito via CSS, reforço)
  document.addEventListener("dragstart", (e) => {
    if ((e.target as HTMLElement)?.tagName === "IMG") e.preventDefault();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
