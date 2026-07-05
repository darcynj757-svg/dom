// КедрДом — branded video scene

import { motion } from 'framer-motion';

export function KedrDomScene() {

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#1c1a17' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.4, duration: 1.8 }}
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, #b45309 0%, transparent 70%)',
        }}
      />

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-8 gap-0">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px w-10 bg-amber-400/60" />
          <span
            className="text-amber-400/90 uppercase tracking-[0.28em] font-semibold"
            style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.85rem)', fontFamily: 'var(--font-display, sans-serif)' }}
          >
            Строительство деревянных домов
          </span>
          <div className="h-px w-10 bg-amber-400/60" />
        </motion.div>

        {/* Main title */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.55, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 10rem)',
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            КедрДом
          </motion.h1>
        </div>

        {/* Italic tagline */}
        <div className="overflow-hidden mb-12">
          <motion.p
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.75, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 3.8rem)',
              fontFamily: 'var(--font-display, sans-serif)',
              fontWeight: 800,
              fontStyle: 'italic',
              color: '#fcd34d',
              lineHeight: 1.1,
            }}
          >
            надёжно, в срок, с гарантией
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-6 md:gap-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {[
            { value: '25', label: 'лет\nопыта' },
            { value: '200+', label: 'домов\nпостроено' },
            { value: '10', label: 'лет\nгарантии' },
          ].map((stat, i) => (
            <motion.div
              key={stat.value}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.15, duration: 0.5, ease: 'backOut' }}
            >
              <span
                style={{
                  fontSize: 'clamp(1.6rem, 4vw, 3.5rem)',
                  fontFamily: 'var(--font-display, sans-serif)',
                  fontWeight: 900,
                  color: '#fbbf24',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-white/50 mt-1 whitespace-pre-line text-center"
                style={{ fontSize: 'clamp(0.55rem, 1vw, 0.75rem)', lineHeight: 1.3 }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom line */}
        <motion.div
          className="mt-12 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
          style={{ width: 'clamp(120px, 40vw, 320px)' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.p
          className="mt-5 text-white/35 tracking-[0.18em] uppercase"
          style={{ fontSize: 'clamp(0.55rem, 1vw, 0.7rem)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          kedr-tomsk.ru · с 2001 года
        </motion.p>
      </div>
    </motion.div>
  );
}

export default KedrDomScene;
