import { useSyncExternalStore } from "react";

/**
 * How this browser can install the app:
 * - "prompt": Chromium (Chrome, Edge, Samsung Internet, Android) fired
 *   beforeinstallprompt, so we can show the native install dialog.
 * - "ios": iPhone / iPad, installed by hand via Share → Add to Home Screen.
 * - "mac-safari": Safari on macOS, installed via File → Add to Dock.
 * - null: already installed, or the browser can't install web apps.
 */
export type InstallPlatform = "prompt" | "ios" | "mac-safari" | null;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Registered at module load (during hydration) so the event isn't missed.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // keep Chrome's mini-infobar away; we show our own popup
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function detect(): InstallPlatform {
  if (installed || isStandalone()) return null;
  if (deferred) return "prompt";
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch support gives it away.
  const iOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  const safari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(ua);
  if (/Macintosh/.test(ua) && safari) return "mac-safari";
  return null;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

export function useInstallPlatform(): InstallPlatform {
  return useSyncExternalStore(subscribe, detect, () => null);
}

/** Shows the browser's native install dialog (only for the "prompt" platform). */
export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  const event = deferred;
  await event.prompt();
  const { outcome } = await event.userChoice;
  // A prompt event can only be used once.
  deferred = null;
  emit();
  return outcome === "accepted";
}
