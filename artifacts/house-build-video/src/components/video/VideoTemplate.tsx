// Video Template — КедрДом branded scene

import { AnimatePresence } from 'framer-motion';

import { KedrDomScene } from './KedrDomScene';

export default function VideoTemplate() {
  return (
    <div className="w-full h-screen overflow-hidden relative" style={{ background: '#1c1a17' }}>
      <AnimatePresence>
        <KedrDomScene key="kedrdom" />
      </AnimatePresence>
    </div>
  );
}
