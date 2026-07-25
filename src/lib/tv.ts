// Deteção e utilitários para Android TV / Google TV / Fire TV / Smart TV
export const TV_STORAGE_KEY = "prismafly_tv_mode";

export function detectTVDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const tvUA =
    /Android\s?TV|GoogleTV|Google TV|SMART-TV|SmartTV|HbbTV|NetCast|Web0S|webOS TV|Tizen|BRAVIA|AFTB|AFTM|AFTT|AFTS|AFTN|AFTA|CrKey|Chromecast|TV Safari|Philips|VIDAA|Hisense|Roku/i.test(
      ua
    );
  if (tvUA) return true;
  // Ecrã grande sem toque nem rato preciso => quase de certeza TV
  const coarse =
    window.matchMedia?.("(pointer: none), (pointer: coarse)").matches ?? false;
  const noTouch = (navigator.maxTouchPoints || 0) === 0;
  return window.innerWidth >= 1280 && coarse && noTouch;
}

export function getTVMode(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(TV_STORAGE_KEY);
  if (stored === "on") return true;
  if (stored === "off") return false;
  return detectTVDevice();
}

export function setTVMode(on: boolean | null) {
  if (on === null) localStorage.removeItem(TV_STORAGE_KEY);
  else localStorage.setItem(TV_STORAGE_KEY, on ? "on" : "off");
  window.dispatchEvent(new Event("prismafly-tv-change"));
}

/** Navegação espacial por D-pad entre elementos [data-focusable] */
export function spatialNavigate(key: string) {
  const active = document.activeElement as HTMLElement | null;
  const items = Array.from(
    document.querySelectorAll<HTMLElement>("[data-focusable]")
  ).filter((el) => el.offsetParent !== null);
  if (!items.length) return false;
  if (!active || !active.hasAttribute("data-focusable")) {
    items[0].focus();
    items[0].scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    return true;
  }
  const a = active.getBoundingClientRect();
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;

  let best: HTMLElement | null = null;
  let bestScore = Infinity;
  for (const el of items) {
    if (el === active) continue;
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const dx = x - ax;
    const dy = y - ay;
    const ok =
      (key === "ArrowRight" && dx > 8) ||
      (key === "ArrowLeft" && dx < -8) ||
      (key === "ArrowDown" && dy > 8) ||
      (key === "ArrowUp" && dy < -8);
    if (!ok) continue;
    const primary = key === "ArrowLeft" || key === "ArrowRight" ? Math.abs(dx) : Math.abs(dy);
    const cross = key === "ArrowLeft" || key === "ArrowRight" ? Math.abs(dy) : Math.abs(dx);
    const score = primary + cross * 2.5;
    if (score < bestScore) {
      bestScore = score;
      best = el;
    }
  }
  if (best) {
    best.focus();
    best.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    return true;
  }
  return false;
}
