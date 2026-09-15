import { useEffect, useRef, useState } from "react";
import { ArrowDown, Camera, Film, Pause, Play } from "lucide-react";

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/cinematic-site-construction-test.mp4`;
const POSTER_SRC = `${import.meta.env.BASE_URL}posters/cinematic-site-construction-test.jpg`;
const FALLBACK_DURATION = 15;

const PHASES = [
  {
    label: "Фундамент",
    eyebrow: "01 / Фундамент",
    title: "Начинаем с основания",
    body: "Первым появляется фундамент — точная опора для дома, который будет служить десятилетиями.",
    detail: "Монолитный ж/б · глубина 1,8 м · арматура ø12 мм",
    start: 0,
  },
  {
    label: "Лаги пола",
    eyebrow: "02 / Лаги пола",
    title: "Собираем основу дома",
    body: "На фундамент устанавливаем лаги пола — прочную и ровную основу для первого венца.",
    detail: "Лиственница 50×200 мм · шаг 600 мм · антисептик",
    start: 0.25,
  },
  {
    label: "Стены",
    eyebrow: "03 / Стены",
    title: "Дом растёт по венцам",
    body: "Профилированный брус поднимается слой за слоем, формируя тёплый контур и силуэт будущего дома.",
    detail: "Кедр сибирский · брус 150×200 мм · межвенцовый утеплитель",
    start: 0.5,
  },
  {
    label: "Кровля",
    eyebrow: "04 / Кровля и облёт",
    title: "Силуэт дома готов",
    body: "Последний слой — кровля. Камера облетает тот же дом и показывает его готовую форму со всех сторон.",
    detail: "Металлочерепица · обрешётка · гидробарьер",
    start: 0.75,
  },
];

function getPhase(progress: number) {
  return [...PHASES].reverse().find((phase) => progress >= phase.start) ?? PHASES[0];
}

export default function HouseVideoScrollTest() {
  const storyRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const durationRef = useRef(FALLBACK_DURATION);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [isReady, setIsReady] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    if (manualMode) return;

    const syncFromScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        const story = storyRef.current;
        const video = videoRef.current;
        if (!story) return;

        const start = story.offsetTop;
        const end = story.offsetTop + story.offsetHeight - window.innerHeight;
        const nextProgress = Math.min(Math.max((window.scrollY - start) / Math.max(end - start, 1), 0), 1);
        const nextTime = nextProgress * durationRef.current;

        setProgress((current) => (Math.abs(current - nextProgress) < 0.001 ? current : nextProgress));
        if (video && video.readyState >= 1 && Math.abs(video.currentTime - nextTime) > 0.02) {
          video.currentTime = nextTime;
        }
      });
    };

    syncFromScroll();
    window.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);
    return () => {
      window.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [manualMode]);

  const phase = getPhase(progress);
  const currentTime = progress * duration;

  return (
    <main className="min-h-[100dvh] bg-[#101512] text-white">
      <header className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 pb-8 pt-28 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d8bc78]">
            <Film className="h-3.5 w-3.5" />
            Cinematic site study / scroll test
          </div>
          <h1 className="font-display text-3xl font-black tracking-[-0.05em] md:text-5xl">
            Стройка на реальном участке
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#b7beb5] md:text-base">
            Временный cinematic fallback для проверки scroll Hero. Production HERO и текущая
            3D-модель остаются без изменений.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#b7beb5]">
          <span className="rounded-full border border-[#d8bc78]/35 bg-[#d8bc78]/10 px-3 py-1.5 text-[#e8d498]">
            16:9
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1.5">Fallback video</span>
        </div>
      </header>

      <section ref={storyRef} className="relative min-h-[235vh] px-4 md:px-8">
        <div className="sticky top-20 mx-auto max-w-[1440px]">
          <div className="relative aspect-video overflow-hidden rounded-[1.4rem] border border-white/15 bg-black shadow-[0_28px_100px_rgba(0,0,0,0.34)]">
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              poster={POSTER_SRC}
              className="absolute inset-0 h-full w-full object-cover"
              onLoadedMetadata={(event) => {
                const nextDuration = Number.isFinite(event.currentTarget.duration)
                  ? event.currentTarget.duration
                  : FALLBACK_DURATION;
                durationRef.current = nextDuration;
                setDuration(nextDuration);
                setIsReady(true);
              }}
              onError={() => setIsReady(false)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/20" />

            <div className="absolute left-[5%] top-[7%]">
              <div
                data-house-slide-eyebrow
                className="flex items-center gap-2 text-[clamp(8px,0.7vw,12px)] font-bold uppercase tracking-[0.24em] text-white/75"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#d8bc78]" />
                {phase.eyebrow}
              </div>
              <div
                data-house-slide-title
                className="mt-2 max-w-[70vw] font-display text-[clamp(20px,3.2vw,52px)] font-black leading-none tracking-[-0.05em]"
              >
                {phase.title}
              </div>
              <p className="mt-3 max-w-[34rem] text-[clamp(11px,1.1vw,17px)] leading-relaxed text-white/80">
                {phase.body}
              </p>
              <div className="mt-3 text-[clamp(8px,0.62vw,11px)] font-bold uppercase tracking-[0.16em] text-[#e8d498]">
                {phase.detail}
              </div>
            </div>

            <div className="absolute right-[5%] top-[7%] text-right">
              <div className="font-mono text-[clamp(12px,1vw,16px)] tabular-nums text-white/90">
                {currentTime.toFixed(1).padStart(4, "0")} / {duration.toFixed(1)} sec
              </div>
              <div className="mt-1 text-[clamp(8px,0.58vw,10px)] uppercase tracking-[0.2em] text-white/60">
                {isReady ? "scroll synced" : "loading video"}
              </div>
            </div>

            <div className="absolute bottom-[7%] left-[5%] flex items-center gap-3 text-xs font-semibold text-white/80">
              <ArrowDown className="h-4 w-4 animate-bounce text-[#d8bc78]" />
              Прокрутите вниз — видео будет двигаться вместе со страницей
            </div>

            <div className="absolute bottom-[7%] right-[5%] flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#d8bc78]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/75">
                natural site / continuous shot
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#1d241f] p-4 md:p-5">
            <div className="relative h-6">
              <div className="absolute inset-x-0 top-2.5 h-1 rounded-full bg-white/15" />
              <div className="absolute left-0 top-2.5 h-1 rounded-full bg-[#d8bc78]" style={{ width: `${progress * 100}%` }} />
              {PHASES.map((item) => (
                <div key={item.label} className="absolute top-0.5 -translate-x-1/2" style={{ left: `${item.start * 100}%` }}>
                  <span className={`block h-5 w-5 rounded-full border-2 ${progress >= item.start ? "border-[#d8bc78] bg-[#d8bc78]" : "border-white/30 bg-[#1d241f]"}`} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between gap-2 text-[9px] font-bold uppercase tracking-[0.12em] text-white/55 md:text-[10px]">
              {PHASES.map((item) => <span key={item.label} className={phase.label === item.label ? "text-[#e8d498]" : ""}>{item.label}</span>)}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setManualMode((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/75 hover:border-[#d8bc78]/60 hover:text-white"
              >
                {manualMode ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                {manualMode ? "Вернуть scroll-связку" : "Scroll sync on"}
              </button>
              <span className="text-right text-xs text-white/50">
                {manualMode ? "Ручной режим остановлен" : "Прокрутка управляет currentTime видео"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}