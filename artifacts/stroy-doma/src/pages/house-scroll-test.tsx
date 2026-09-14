import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Copy,
  Expand,
  Layers3,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
  Sparkles,
} from "lucide-react";

const ScrollHouse = lazy(() => import("@/components/3d/ScrollHouse"));

const DURATION_SECONDS = 15;

const PHASES = [
  { id: "foundation", label: "Фундамент", short: "01", start: 0, end: 3.2 },
  { id: "joists", label: "Лаги пола", short: "02", start: 3.2, end: 6.1 },
  { id: "walls", label: "Стены", short: "03", start: 6.1, end: 9.1 },
  { id: "roof", label: "Кровля", short: "04", start: 9.1, end: 11.2 },
  { id: "orbit", label: "Готовый дом", short: "05", start: 11.2, end: 15 },
] as const;

function formatTime(value: number) {
  const seconds = Math.max(0, Math.min(DURATION_SECONDS, value));
  return `00:${seconds.toFixed(1).padStart(4, "0")}`;
}

function getPhase(time: number) {
  return PHASES.find((phase) => time >= phase.start && time < phase.end) ?? PHASES[PHASES.length - 1];
}

function playheadPercent(time: number) {
  return `${(time / DURATION_SECONDS) * 100}%`;
}

export default function HouseScrollTest() {
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollLinked, setScrollLinked] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const progress = elapsed / DURATION_SECONDS;
  const phase = getPhase(elapsed);

  const progressPayload = useMemo(
    () => ({
      progress,
      elapsed,
      duration: DURATION_SECONDS,
      phase: phase.id,
    }),
    [elapsed, phase.id, progress],
  );

  useEffect(() => {
    const modelRoot = document.querySelector<HTMLElement>("[data-house-model-ready]");
    if (!modelRoot) return;

    const syncReady = () => setIsModelReady(modelRoot.dataset.houseModelReady === "true");
    syncReady();
    const observer = new MutationObserver(syncReady);
    observer.observe(modelRoot, { attributes: true, attributeFilter: ["data-house-model-ready"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const event = new CustomEvent("kedr-house-test-progress", { detail: progressPayload });
    window.dispatchEvent(event);
    document.documentElement.dataset.kedrHouseTestProgress = progress.toFixed(4);
    (
      window as Window & {
        __KEDR_HOUSE_SCROLL_TEST__?: typeof progressPayload;
      }
    ).__KEDR_HOUSE_SCROLL_TEST__ = progressPayload;
  }, [progressPayload, progress]);

  useEffect(() => {
    if (!scrollLinked) return;

    const syncFromScroll = () => {
      const stage = stageRef.current;
      if (!stage) return;

      const start = Math.max(0, stage.offsetTop - 120);
      const range = Math.max(stage.offsetHeight + window.innerHeight * 0.5, 1);
      const nextProgress = Math.min(Math.max((window.scrollY - start) / range, 0), 1);
      setElapsed(nextProgress * DURATION_SECONDS);
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [scrollLinked]);

  useEffect(() => {
    if (scrollLinked) {
      lastFrameRef.current = null;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }
    if (!isPlaying) {
      lastFrameRef.current = null;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp;
      const delta = (timestamp - lastFrameRef.current) / 1000;
      lastFrameRef.current = timestamp;
      setElapsed((current) => {
        const next = current + delta;
        if (next >= DURATION_SECONDS) {
          setIsPlaying(false);
          return DURATION_SECONDS;
        }
        return next;
      });
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      lastFrameRef.current = null;
    };
  }, [isPlaying, scrollLinked]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        setIsPlaying((value) => !value);
      }
      if (event.key === "ArrowLeft") setElapsed((value) => Math.max(0, value - 0.5));
      if (event.key === "ArrowRight") setElapsed((value) => Math.min(DURATION_SECONDS, value + 0.5));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleRestart = () => {
    setScrollLinked(false);
    setElapsed(0);
    setIsPlaying(true);
  };

  const handleScrub = (value: string) => {
    setScrollLinked(false);
    setElapsed(Number(value));
    if (Number(value) < DURATION_SECONDS) setIsPlaying(false);
  };

  const handleCopyProgress = async () => {
    const snippet = `houseProgress = ${progress.toFixed(4)}; // ${formatTime(elapsed)}`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void stageRef.current?.requestFullscreen?.();
  };

  return (
    <main className="min-h-[100dvh] bg-[#181a17] px-4 pb-16 pt-24 text-[#efe8d7] md:px-8 md:pt-28">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-7 flex flex-col justify-between gap-5 border-b border-[#d5bc7a]/20 pb-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d5bc7a]">
              <ScanLine className="h-3.5 w-3.5" />
              Internal motion study / build 01
            </div>
            <h1 className="font-display text-3xl font-black tracking-[-0.04em] text-[#f6f0e3] md:text-5xl">
              House scroll sequence
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#aeb0a5] md:text-base">
              Тестовая 3D-сцена для будущей связи HERO со скроллом. GLB-модель проходит путь от
              основания до готового дома, а последние секунды отданы плавному орбитальному проходу.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#aeb0a5]">
            <span className="rounded-full border border-[#d5bc7a]/35 bg-[#d5bc7a]/10 px-3 py-1.5 text-[#d5bc7a]">
              16:9
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">15 sec</span>
              <button
                type="button"
                onClick={() => setScrollLinked((value) => !value)}
                className={`rounded-full border px-3 py-1.5 transition-colors ${
                  scrollLinked
                    ? "border-[#76a88a]/50 bg-[#76a88a]/10 text-[#a8d1ae]"
                    : "border-white/10 text-[#aeb0a5]"
                }`}
              >
                {scrollLinked ? "SCROLL LINKED" : "MANUAL PREVIEW"}
              </button>
              <span className="rounded-full border border-white/10 px-3 py-1.5">GLB / live</span>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0">
            <div
              ref={stageRef}
              data-house-test-stage
              data-house-test-progress={progress.toFixed(4)}
              className="group relative aspect-video overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#d9d1c0] shadow-[0_28px_90px_rgba(0,0,0,0.28)] [--grid-color:rgba(91,87,70,0.12)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_53%_42%,rgba(251,246,229,0.96),rgba(207,199,180,0.86)_60%,rgba(158,153,139,0.9))]" />
              <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] [background-size:4.2vw_4.2vw]" />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#25302c]/20 to-transparent" />
              <div className="absolute bottom-[13%] left-[12%] right-[12%] h-px bg-[#6b6659]/30" />

              <div className="absolute left-[4.4%] top-[6.5%] z-10">
                <div className="flex items-center gap-2 text-[clamp(8px,0.72vw,12px)] font-bold uppercase tracking-[0.24em] text-[#4c544b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ba8f3c] shadow-[0_0_0_4px_rgba(186,143,60,0.16)]" />
                  Kedr / Tomsk
                </div>
                <div className="mt-2 font-display text-[clamp(15px,2vw,34px)] font-black leading-none tracking-[-0.045em] text-[#27302b]">
                  Конструкция в движении
                </div>
              </div>

              <div className="absolute right-[4.4%] top-[6.5%] z-10 text-right">
                <div className="font-mono text-[clamp(10px,0.85vw,14px)] font-bold tabular-nums text-[#4c544b]">
                  {formatTime(elapsed)}
                </div>
                <div className="mt-1 text-[clamp(8px,0.58vw,10px)] uppercase tracking-[0.2em] text-[#6b6c61]">
                  {isModelReady ? "model ready" : "loading model"}
                </div>
              </div>

              <div className="absolute inset-0 z-[1]">
                <Suspense fallback={null}>
                  <ScrollHouse progress={progress} backgroundColor="#d9d1c0" />
                </Suspense>
              </div>

              <div className="absolute bottom-[7%] left-[4.4%] z-10 max-w-[48%]">
                <div className="mb-2 flex items-center gap-2 text-[clamp(8px,0.65vw,11px)] font-bold uppercase tracking-[0.2em] text-[#6b6c61]">
                  <Layers3 className="h-[1em] w-[1em]" />
                  Current layer
                </div>
                <div className="font-display text-[clamp(19px,2.8vw,46px)] font-black leading-[0.95] tracking-[-0.05em] text-[#27302b]">
                  {phase.label}
                </div>
                <div className="mt-2 text-[clamp(9px,0.78vw,13px)] font-semibold text-[#62665b]">
                  {phase.id === "orbit"
                    ? "Камера обходит готовый объём и ищет финальный ракурс."
                    : "Слой проявляется снизу вверх, без замены исходной GLB-модели."}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFullscreen}
                className="absolute bottom-[7%] right-[4.4%] z-20 flex items-center gap-2 rounded-full border border-[#27302b]/20 bg-[#f1eadc]/75 px-3 py-2 text-[clamp(8px,0.65vw,11px)] font-bold uppercase tracking-[0.14em] text-[#27302b] opacity-0 backdrop-blur-sm transition-opacity hover:bg-[#f8f2e7] focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Expand className="h-3.5 w-3.5" />
                Frame
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-[#232620] p-4 md:p-5">
              <div className="relative mb-3 h-6">
                <div className="absolute inset-x-0 top-2.5 h-1 rounded-full bg-[#4c5147]" />
                <div
                  className="absolute left-0 top-2.5 h-1 rounded-full bg-[#d5bc7a]"
                  style={{ width: playheadPercent(elapsed) }}
                />
                {PHASES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    aria-label={`Перейти к этапу: ${item.label}`}
                    onClick={() => {
                      setElapsed(item.start);
                      setIsPlaying(false);
                    }}
                    className="absolute top-0.5 -translate-x-1/2"
                    style={{ left: playheadPercent(item.start) }}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full border-2 transition-colors ${
                        elapsed >= item.start
                          ? "border-[#d5bc7a] bg-[#d5bc7a]"
                          : "border-[#777b6e] bg-[#232620]"
                      }`}
                    />
                  </button>
                ))}
                <input
                  aria-label="Позиция анимации"
                  type="range"
                  min="0"
                  max={DURATION_SECONDS}
                  step="0.01"
                  value={elapsed}
                  onChange={(event) => handleScrub(event.target.value)}
                  className="absolute inset-x-0 top-0 h-6 w-full cursor-ew-resize opacity-0"
                />
              </div>
              <div className="flex justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#92988a] md:text-[10px]">
                {PHASES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setElapsed(item.start);
                      setIsPlaying(false);
                    }}
                    className={`text-left transition-colors hover:text-[#f0dfac] ${
                      phase.id === item.id ? "text-[#d5bc7a]" : ""
                    }`}
                  >
                    <span className="mr-1.5 text-[#62695b]">{item.short}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setScrollLinked(false);
                      setIsPlaying((value) => !value);
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d5bc7a] text-[#252921] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5bc7a]"
                    aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-bold uppercase tracking-[0.12em] text-[#c0c4b8] transition-colors hover:border-[#d5bc7a]/50 hover:text-[#f0dfac]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Restart
                  </button>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs tabular-nums text-[#aeb0a5]">
                  <Clock3 className="h-3.5 w-3.5 text-[#d5bc7a]" />
                  {formatTime(elapsed)} <span className="text-[#596055]">/ 00:15.0</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-[#20231e] p-5 md:p-6">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d5bc7a]">
              <Sparkles className="h-3.5 w-3.5" />
              Scrub handoff
            </div>
            <h2 className="mt-4 font-display text-xl font-black tracking-[-0.03em] text-[#f6f0e3]">
              Progress API
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#aeb0a5]">
              Прогресс живёт в диапазоне <code className="text-[#e2cc91]">0…1</code> и уже
              отправляется событием для будущей HERO-связки.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#171a16] p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#7d8575]">houseProgress</span>
                <strong className="font-mono text-2xl tabular-nums text-[#f0dfac]">{progress.toFixed(3)}</strong>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#454b40]">
                <div className="h-full rounded-full bg-[#d5bc7a] transition-[width] duration-100" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-[#778071]">
                <span>{phase.label}</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyProgress}
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#d5bc7a]/30 bg-[#d5bc7a]/10 px-4 py-3 text-left text-xs font-bold text-[#e8d8a8] transition-colors hover:bg-[#d5bc7a]/20"
            >
              <span>{copied ? "Скопировано в буфер" : "Скопировать текущее значение"}</span>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>

            <div className="mt-7 border-t border-white/10 pt-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7d8575]">Event contract</div>
              <code className="mt-3 block break-all rounded-lg bg-[#171a16] p-3 text-[11px] leading-relaxed text-[#b7c09e]">
                kedr-house-test-progress
              </code>
              <p className="mt-3 text-xs leading-relaxed text-[#7d8575]">
                <code className="text-[#cfc28f]">window.__KEDR_HOUSE_SCROLL_TEST__</code> также
                обновляется на каждом кадре.
              </p>
            </div>

            <div className="mt-7 flex gap-3 border-t border-white/10 pt-5 text-xs leading-relaxed text-[#7d8575]">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#76a88a]" />
              <p>Production HERO и ScrollHouse не затронуты: это отдельный внутренний маршрут.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}