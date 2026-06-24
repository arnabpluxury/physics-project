'use client';

import { useEffect, useState } from 'react';

const GIFS = [
  '/patapata.gif',
  '/spyfamily.gif',
  '/titan-dance.gif',
];

export function BackgroundGifAnimation() {
  const [gif, setGif] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Select random GIF
    const randomGif = GIFS[Math.floor(Math.random() * GIFS.length)];
    setGif(randomGif);
    setIsAnimating(true);

    // Animation duration is 2.5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!gif || !isAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 animate-gif-zoom"
        style={{
          backgroundImage: `url(${gif})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.4,
        }}
      />
    </div>
  );
}
