import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Assets
import blueprintBg from "@/assets/generated_images/blueprint-bg.webp";
import concreteBg from "@/assets/generated_images/concrete-earth-bg.webp";
import interiorBg from "@/assets/generated_images/wooden-interior-bg.webp";
import logsVideo from "@/assets/generated_videos/siberian-logs-construction.mp4";

const SCENES = 6;
const SCENE_DURATIONS = [6000, 7000, 7000, 8000, 8000, 9000];

export default function MarketingVideo() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScene((prev) => (prev + 1) % SCENES);
    }, SCENE_DURATIONS[scene]);
    return () => clearTimeout(timer);
  }, [scene]);

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl shadow-2xl border border-border">
      
      {/* Persistent Background Layer for depth */}
      <div className="absolute inset-0 bg-black" />

      {/* Global Grain/Noise */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Persistent Gold Accent Line */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-[#B69D72] z-40"
        initial={{ width: "0%" }}
        animate={{ width: `${((scene + 1) / SCENES) * 100}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <AnimatePresence mode="popLayout">
        {scene === 0 && <SceneHero key="s0" />}
        {scene === 1 && <SceneProekt key="s1" />}
        {scene === 2 && <SceneFundament key="s2" />}
        {scene === 3 && <SceneSrub key="s3" />}
        {scene === 4 && <SceneOtdelka key="s4" />}
        {scene === 5 && <SceneCTA key="s5" />}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// SCENE 1: HERO
// ==========================================
function SceneHero() {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(182,157,114,0.15)_0%,_transparent_60%)]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="text-yellow-400/80 uppercase tracking-[0.5em] text-sm md:text-base font-medium mb-6"
      >
        Kedr Tomsk
      </motion.div>

      <div className="overflow-hidden mb-8">
        <motion.h1
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-center px-4 leading-tight font-medium"
        >
          Полный цикл <br />
          <span className="text-white/90">строительства</span>
        </motion.h1>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2, ease: "easeInOut" }}
        className="h-[2px] bg-[#B69D72] w-24 md:w-32"
      />
    </motion.div>
  );
}

// ==========================================
// SCENE 2: ПРОЕКТИРОВАНИЕ
// ==========================================
function SceneProekt() {
  return (
    <motion.div
      className="absolute inset-0 bg-black overflow-hidden flex flex-col justify-end p-12 md:p-20"
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{ clipPath: "circle(150% at 50% 50%)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.img
        src={blueprintBg}
        alt="Blueprint"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 6, ease: "linear" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-8xl md:text-[10rem] font-serif font-black text-white/10 leading-none -mb-8 md:-mb-12"
          >
            01
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="font-serif text-4xl md:text-6xl text-white font-medium"
          >
            Проектирование
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="bg-[#B69D72]/20 backdrop-blur-md border border-[#B69D72]/30 px-6 py-3 rounded-full text-white/90 text-lg md:text-xl whitespace-nowrap"
        >
          от 400 ₽ / м²
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 3: ФУНДАМЕНТ + ПЛАНИРОВКА
// ==========================================
function SceneFundament() {
  return (
    <motion.div
      className="absolute inset-0 flex"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative w-1/2 h-full bg-[#111] overflow-hidden border-r border-[#B69D72]/20">
        <motion.img
          src={concreteBg}
          alt="Concrete"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: "linear" }}
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#B69D72] text-sm uppercase tracking-widest mb-4"
          >
            02 / Планировка
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="font-serif text-3xl md:text-4xl text-white mb-6"
          >
            Участок и дренаж
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-white/50 text-lg"
          >
            Индивидуально
          </motion.div>
        </div>
      </div>
      
      <div className="relative w-1/2 h-full bg-black overflow-hidden">
        <motion.img
          src={concreteBg}
          alt="Earth"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: "linear" }}
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity sepia-[0.3]"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-[#B69D72] text-sm uppercase tracking-widest mb-4"
          >
            03 / Фундамент
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="font-serif text-3xl md:text-4xl text-white mb-6"
          >
            Надёжная опора
          </motion.h3>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.1 }}
            className="text-white/90 text-lg border border-white/20 px-4 py-2 inline-block rounded max-w-max backdrop-blur-sm"
          >
            от 4 000 ₽ / м³
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 4: МОНТАЖ СРУБА
// ==========================================
function SceneSrub() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = "auto";
          el.load();
          el.play().catch(() => {});
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      className="absolute inset-0 bg-black flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, filter: "blur(20px)" }}
      transition={{ duration: 1.5 }}
    >
      <video
        ref={videoRef}
        src={logsVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/posters/siberian-logs-construction.webp"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] border border-[#B69D72]/40 rounded-full flex flex-col justify-center items-center p-8 backdrop-blur-sm bg-black/20"
        >
          <span className="text-[#B69D72] text-sm uppercase tracking-[0.3em] mb-4">04</span>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-6">
            Монтаж сруба
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-xl md:text-2xl text-white/80"
          >
            от 60 000 ₽ / м²
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 5: ОТДЕЛКА ПОД КЛЮЧ
// ==========================================
function SceneOtdelka() {
  return (
    <motion.div
      className="absolute inset-0 bg-black"
      initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
      animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.img
        src={interiorBg}
        alt="Interior"
        initial={{ x: 50, scale: 1.1 }}
        animate={{ x: 0, scale: 1 }}
        transition={{ duration: 8, ease: "linear" }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-10 h-full flex flex-col justify-center p-12 md:p-24 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-[#B69D72] text-xl font-serif italic mb-4"
        >
          Финальный этап
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="font-serif text-5xl md:text-7xl text-white font-medium leading-tight mb-8"
        >
          Отделка<br />под ключ
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="inline-block border-l-4 border-[#B69D72] pl-6 text-white/80 text-xl md:text-2xl"
        >
          от 30 000 ₽ / м²
        </motion.div>
      </div>
    </motion.div>
  );
}

// ==========================================
// SCENE 6: CTA
// ==========================================
function SceneCTA() {
  return (
    <motion.div
      className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ scale: 0 }}
        animate={{ scale: 2 }}
        transition={{ duration: 9, ease: "linear" }}
        style={{
          backgroundImage: "radial-gradient(circle at center, #B69D72 0%, transparent 50%)"
        }}
      />
      
      <div className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-5xl md:text-7xl text-white font-medium mb-6"
        >
          Оставьте заявку
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="text-[#B69D72] uppercase tracking-[0.3em] text-lg"
        >
          Kedr Tomsk
        </motion.p>
      </div>
    </motion.div>
  );
}
