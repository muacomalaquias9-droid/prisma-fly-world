import { useEffect, useState } from "react";
import { getTVMode, spatialNavigate } from "@/lib/tv";

/** Retorna true quando a app deve usar a interface de Android TV */
export function useTVMode() {
  const [tv, setTv] = useState<boolean>(() => getTVMode());

  useEffect(() => {
    const sync = () => setTv(getTVMode());
    window.addEventListener("prismafly-tv-change", sync);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("prismafly-tv-change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("tv-mode", tv);
  }, [tv]);

  return tv;
}

/** Ativa a navegação por comando (D-pad) enquanto o componente estiver montado */
export function useDpadNavigation(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (spatialNavigate(e.key)) e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
