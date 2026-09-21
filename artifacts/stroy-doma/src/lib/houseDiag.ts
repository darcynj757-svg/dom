/**
 * Temporary field diagnostics for the 3D house block. Collects a short
 * timeline (downloads, WebGL, first frame, errors) and sends it once to
 * /api/client-log so real-phone behaviour can be read in the server logs.
 * No personal data is collected.
 */
type DiagEvent = [name: string, ms: number, info?: string];

const events: DiagEvent[] = [];
let sends = 0;
const enabled =
  typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "";

export function diag(name: string, info?: string) {
  if (!enabled || events.length > 80) return;
  events.push([name, Math.round(performance.now()), info?.slice(0, 300)]);
}

export function flushDiag(reason: string) {
  if (!enabled || sends >= 2 || events.length === 0) return;
  sends += 1;
  const nav = navigator as Navigator & { connection?: { effectiveType?: string; downlink?: number } };
  const body = JSON.stringify({
    reason,
    ua: navigator.userAgent,
    viewport: [window.innerWidth, window.innerHeight, window.devicePixelRatio],
    net: nav.connection ? `${nav.connection.effectiveType ?? ""} ${nav.connection.downlink ?? ""}` : "",
    scrollY: Math.round(window.scrollY),
    events,
  });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/client-log", blob)) {
      void fetch("/api/client-log", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    // Diagnostics must never affect the page.
  }
}

if (enabled) {
  diag("boot");
  window.addEventListener("error", (e) => diag("error", `${e.message} @${e.filename}:${e.lineno}`));
  window.addEventListener("unhandledrejection", (e) => diag("rejection", String((e as PromiseRejectionEvent).reason)));
  window.addEventListener("pagehide", () => flushDiag("pagehide"));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushDiag("hidden");
  });
  window.setTimeout(() => flushDiag("timer"), 25000);
}
