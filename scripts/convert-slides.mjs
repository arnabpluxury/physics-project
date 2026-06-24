import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf8');
const containerMatch = html.match(
  /<div class="presentation-container">([\s\S]*?)<\/div>\s*<div class="presentation-chrome"/
);
if (!containerMatch) throw new Error('presentation-container not found');

const raw = containerMatch[1];
const slideBlocks = raw
  .split(/(?=\s*<div class="slide[\s"])/)
  .map((s) => s.trim())
  .filter((s) => s.startsWith('<div class="slide'));

function transformSlide(block, index) {
  let s = block.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(
    /^<div class="(slide[^"]*)"([^>]*)>/,
    (_, classes, attrs) => {
      const clean = classes.replace(/\s+active\b/, '');
      return `<div className={\`${clean} \${activeIndex === ${index} ? 'active' : ''}\`}${attrs}>`;
    }
  );
  s = s
    .replace(/\bclass=/g, 'className=')
    .replace(/\btabindex=/g, 'tabIndex=')
    .replace(/src="assets\//g, 'src="/assets/')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/&amp;/g, '&');

  const idMatch = s.match(/id="([^"]+)"/);
  const slideId = idMatch?.[1] ?? `slide-${index}`;

  if (s.includes('data-ray-diagram-slide')) {
    s = s.replace(
      /<div className="ray-slide-layout">[\s\S]*?<\/div>\s*(?=<div className="slide-footer">)/,
      '<div className="ray-slide-layout">{rayDiagramSlot}</div>\n        '
    );
  }

  s = s.replace(
    /<tr(\s[^>]*data-lens-case="(\d+)"[^>]*)>/g,
    (_, attrs, caseNum) => {
      const idx = parseInt(caseNum, 10) - 1;
      return `<tr {...lensRowProps('${slideId}', '${caseNum}', ${idx})}${attrs}>`;
    }
  );

  return s;
}

const slides = slideBlocks.map(transformSlide);

const out = `'use client';

import type { ReactNode } from 'react';

export const SLIDE_COUNT = ${slides.length};

type SlideDeckProps = {
  activeIndex: number;
  onLensRowClick?: (slideId: string, caseNum: string, index: number) => void;
  activeLensRow?: { slideId: string; index: number } | null;
  rayDiagramSlot?: ReactNode;
};

export function SlideDeck({ activeIndex, onLensRowClick, activeLensRow, rayDiagramSlot }: SlideDeckProps) {
  const lensRowProps = (slideId: string, caseNum: string, index: number) => ({
    role: 'button' as const,
    tabIndex: 0,
    className: activeLensRow?.slideId === slideId && activeLensRow?.index === index ? 'is-active' : undefined,
    onClick: () => onLensRowClick?.(slideId, caseNum, index),
    onKeyDown: (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onLensRowClick?.(slideId, caseNum, index);
      }
    },
  });

  return (
    <div className="presentation-container">
${slides.map((s, i) => `      {/* Slide ${i + 1} */}\n      ${s.split('\n').join('\n      ')}`).join('\n\n')}
    </div>
  );
}
`;

fs.mkdirSync('components/presentation', { recursive: true });
fs.writeFileSync('components/presentation/SlideDeck.tsx', out);
console.log('OK:', slides.length, 'slides');
