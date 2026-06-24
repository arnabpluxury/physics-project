'use client';

import { DiagramDrawEngine } from '@/lib/diagram-draw-engine';
import { useCallback, useEffect, useRef, useState } from 'react';

const CONVEX_SVG = (
  <svg className="ray-svg" viewBox="0 0 400 260" aria-label="Convex lens ray through optical center" role="img">
    <defs>
      <marker id="ray-arrow-convex" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
      </marker>
    </defs>
    <line className="ray-axis ray-draw-stroke" x1="25" y1="130" x2="375" y2="130" />
    <path className="ray-lens ray-lens--convex ray-draw-stroke" d="M 190 40 C 166 68 166 192 190 220 C 200 225 210 225 210 220 C 234 192 234 68 210 40 C 200 35 190 40 190 40 Z" />
    <circle className="ray-dot ray-draw-fade" cx="130" cy="130" r="4" />
    <circle className="ray-dot ray-draw-fade" cx="200" cy="130" r="4" />
    <circle className="ray-dot ray-draw-fade" cx="270" cy="130" r="4" />
    <text className="ray-label ray-draw-fade" x="130" y="152" textAnchor="middle">F₁</text>
    <text className="ray-label ray-label--o ray-draw-fade" x="200" y="152" textAnchor="middle">O</text>
    <text className="ray-label ray-draw-fade" x="270" y="152" textAnchor="middle">F₂</text>
    <line className="ray-line ray-draw-stroke" x1="55" y1="72" x2="200" y2="130" />
    <line className="ray-line ray-draw-stroke" x1="200" y1="130" x2="345" y2="188" />
  </svg>
);

const CONCAVE_SVG = (
  <svg className="ray-svg" viewBox="0 0 400 260" aria-label="Concave lens ray through optical center" role="img">
    <defs>
      <marker id="ray-arrow-concave" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
      </marker>
    </defs>
    <line className="ray-axis ray-draw-stroke" x1="25" y1="130" x2="375" y2="130" />
    <path className="ray-lens ray-lens--concave ray-draw-stroke" d="M 178 40 L 222 40 L 207 130 L 222 220 L 178 220 L 193 130 Z" />
    <circle className="ray-dot ray-draw-fade" cx="130" cy="130" r="4" />
    <circle className="ray-dot ray-draw-fade" cx="200" cy="130" r="4" />
    <circle className="ray-dot ray-draw-fade" cx="270" cy="130" r="4" />
    <text className="ray-label ray-draw-fade" x="130" y="152" textAnchor="middle">F₁</text>
    <text className="ray-label ray-label--o ray-draw-fade" x="200" y="152" textAnchor="middle">O</text>
    <text className="ray-label ray-draw-fade" x="270" y="152" textAnchor="middle">F₂</text>
    <line className="ray-line ray-draw-stroke" x1="55" y1="72" x2="200" y2="130" />
    <line className="ray-line ray-draw-stroke" x1="200" y1="130" x2="345" y2="188" />
  </svg>
);

export function RayDiagramSlide({ isActive }: { isActive: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [drawn, setDrawn] = useState(false);

  const getSvgs = useCallback(
    () => (gridRef.current ? Array.from(gridRef.current.querySelectorAll<SVGSVGElement>('.ray-svg')) : []),
    []
  );

  const reset = useCallback(() => {
    getSvgs().forEach((s) => DiagramDrawEngine.resetSvg(s));
    setDrawn(false);
    setDrawing(false);
  }, [getSvgs]);

  useEffect(() => {
    if (!isActive) reset();
  }, [isActive, reset]);

  const draw = useCallback(async () => {
    if (drawing || !isActive) return;
    const svgs = getSvgs();
    if (!svgs.length) return;
    if (drawn) {
      svgs.forEach((s) => DiagramDrawEngine.resetSvg(s));
      await DiagramDrawEngine.wait(50);
    }
    setDrawing(true);
    try {
      await Promise.all(svgs.map((s) => DiagramDrawEngine.drawSequence(s)));
      setDrawn(true);
    } finally {
      setDrawing(false);
    }
  }, [drawn, drawing, getSvgs, isActive]);

  return (
    <>
      <p className="ray-slide-rule">
        Any light ray passing directly through the <strong>optical center (O)</strong> continues on the other side{' '}
        <strong>without bending</strong> — for both convex and concave lenses.
      </p>
      <div className="ray-diagram-grid" ref={gridRef} onClick={() => draw()} role="presentation">
        <div className="ray-diagram-panel">
          <h3 className="ray-diagram-panel__title">Convex Lens</h3>
          {CONVEX_SVG}
        </div>
        <div className="ray-diagram-panel">
          <h3 className="ray-diagram-panel__title">Concave Lens</h3>
          {CONCAVE_SVG}
        </div>
      </div>
      <div className="ray-slide-controls">
        <button
          className={`ray-draw-btn${drawn ? ' is-replay' : ''}`}
          id="rayDrawBtn"
          type="button"
          onClick={(e) => { e.stopPropagation(); draw(); }}
          disabled={drawing}
        >
          <i className={`fa-solid ${drawing ? 'fa-spinner fa-spin' : drawn ? 'fa-rotate-right' : 'fa-pen-line'}`} />
          {' '}
          {drawing ? 'Drawing…' : drawn ? 'Replay' : 'Draw Diagram'}
        </button>
        <p className="chart-hint">Click to build the full diagram step-by-step — axis, lens, labels, then ray</p>
      </div>
    </>
  );
}