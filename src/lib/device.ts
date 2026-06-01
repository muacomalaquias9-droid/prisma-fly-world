// Utilitários nativos: vibração e rotação de ecrã.
// Funciona em browsers e ainda melhor quando empacotado como app nativo.

export type HapticPattern = "light" | "medium" | "heavy" | "success" | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [15, 40, 15],
  error: [50, 30, 50, 30, 100],
};

export function vibrate(pattern: HapticPattern = "light") {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(PATTERNS[pattern]);
    }
  } catch {
    /* silencioso */
  }
}

export async function unlockOrientation() {
  try {
    // @ts-ignore — API ainda experimental
    if (typeof screen !== "undefined" && screen.orientation?.unlock) {
      // @ts-ignore
      screen.orientation.unlock();
    }
  } catch {
    /* silencioso */
  }
}

export async function lockOrientation(orientation: "portrait" | "landscape") {
  try {
    // @ts-ignore
    if (typeof screen !== "undefined" && screen.orientation?.lock) {
      // @ts-ignore
      await screen.orientation.lock(orientation);
    }
  } catch {
    /* não suportado em iOS Safari, ok */
  }
}

export function isNativeApp(): boolean {
  if (typeof window === "undefined") return false;
  // Capacitor / Cordova
  // @ts-ignore
  return !!(window.Capacitor || window.cordova);
}
