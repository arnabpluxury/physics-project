'use client';

import Image from 'next/image';

type ChibiCharacterProps = {
  src: string;
  alt: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'small' | 'medium' | 'large';
};

export function ChibiCharacter({ src, alt, position, size = 'medium' }: ChibiCharacterProps) {
  const sizeMap = {
    small: { width: 120, height: 120 },
    medium: { width: 180, height: 180 },
    large: { width: 240, height: 240 },
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: '2rem', left: '2rem' },
    'top-right': { top: '2rem', right: '2rem' },
    'bottom-left': { bottom: '5rem', left: '2rem' },
    'bottom-right': { bottom: '5rem', right: '2rem' },
  };

  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{
        opacity: 0.55,
        ...positionStyles[position],
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className="object-contain"
      />
    </div>
  );
}
