'use client';

import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { ThemeTransitionOverlay } from './ThemeTransitionOverlay';

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayExiting, setOverlayExiting] = useState(false);
  const [fromTheme, setFromTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => setMounted(true), []);

  const handleToggle = useCallback(() => {
    if (isAnimating || !resolvedTheme) return;

    const current = resolvedTheme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    setFromTheme(current);
    setOverlayExiting(false);
    setIsAnimating(true);

    setTheme(next);

    window.setTimeout(() => {
      setOverlayExiting(true);
      window.setTimeout(() => {
        setIsAnimating(false);
        setOverlayExiting(false);
      }, 400);
    }, 1500);
  }, [isAnimating, resolvedTheme, setTheme]);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!mounted || isAnimating}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className={[
          'group relative flex h-11 w-[4.25rem] items-center rounded-full p-1',
          'border border-white/10 bg-black/20 backdrop-blur-xl',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_32px_rgba(0,0,0,0.35)]',
          'transition-all duration-500 ease-out',
          'hover:border-cyan-400/30 hover:shadow-[0_0_24px_rgba(0,240,255,0.15)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
          'disabled:cursor-not-allowed disabled:opacity-60',
          isDark ? 'dark-toggle--dark' : 'dark-toggle--light',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none absolute inset-0 rounded-full opacity-60',
            'bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10',
          ].join(' ')}
          aria-hidden
        />
        <span
          className={[
            'relative z-10 flex h-9 w-9 items-center justify-center rounded-full',
            'bg-gradient-to-br from-white to-zinc-200 text-zinc-800',
            'shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.9)]',
            'transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1)',
            isDark ? 'translate-x-[calc(100%-0.125rem)]' : 'translate-x-0',
          ].join(' ')}
        >
          {!mounted ? (
            <span className="h-4 w-4 rounded-full bg-zinc-300" />
          ) : isDark ? (
            <MoonIcon />
          ) : (
            <SunIcon />
          )}
        </span>
        <span className="sr-only">Toggle color theme</span>
      </button>

      {(isAnimating || overlayExiting) && (
        <ThemeTransitionOverlay fromTheme={fromTheme} exiting={overlayExiting} />
      )}
    </>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-amber-500">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-cyan-300">
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
