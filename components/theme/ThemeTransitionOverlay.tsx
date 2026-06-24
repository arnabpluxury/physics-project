'use client';

import Image from 'next/image';

type ThemeTransitionOverlayProps = {
  fromTheme: 'light' | 'dark';
  exiting: boolean;
};

export function ThemeTransitionOverlay({ fromTheme, exiting }: ThemeTransitionOverlayProps) {
  const isLightOverlay = fromTheme === 'light';

  return (
    <div
      role="presentation"
      aria-hidden
      className={[
        'fixed inset-0 z-[9999] flex items-center justify-center',
        exiting ? 'animate-overlay-out opacity-0' : 'animate-overlay-in opacity-100',
        isLightOverlay
          ? 'bg-white/35 backdrop-blur-2xl backdrop-saturate-150'
          : 'bg-black/45 backdrop-blur-2xl backdrop-saturate-50',
      ].join(' ')}
    >
      <div
        className={[
          'absolute inset-0 pointer-events-none',
          isLightOverlay
            ? 'bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55)_0%,transparent_65%)]'
            : 'bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_55%)]',
        ].join(' ')}
      />
      <div
        className={[
          'relative flex flex-col items-center gap-4 rounded-3xl px-8 py-6',
          'border border-white/15 shadow-2xl',
          isLightOverlay
            ? 'bg-white/25 shadow-black/10'
            : 'bg-black/30 shadow-cyan-500/10',
        ].join(' ')}
      >
        <div className="relative h-48 w-48 overflow-hidden rounded-2xl ring-1 ring-white/20">
          <Image
            src="/titan-dance.gif"
            alt=""
            fill
            unoptimized
            className="object-contain"
            priority
          />
        </div>
        <p
          className={[
            'font-mono text-[10px] uppercase tracking-[0.35em]',
            isLightOverlay ? 'text-zinc-600/80' : 'text-cyan-300/70',
          ].join(' ')}
        >
          Recalibrating optics
        </p>
      </div>
    </div>
  );
}
