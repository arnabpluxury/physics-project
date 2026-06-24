'use client';

import { getLensCases } from '@/data/lens-cases';
import type { LensCaseData } from '@/lib/lens-modal';
import type { DiagramId } from '@/lib/lens-case-diagrams';
import { useEffect, useRef } from 'react';
import { LensModalDiagram } from './LensModalDiagram';

type LensModalProps = {
  open: boolean;
  slideId: string;
  caseIndex: number;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
};

export function LensModal({ open, slideId, caseIndex, onClose, onNavigate }: LensModalProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cases = getLensCases(slideId);
  const data: LensCaseData | undefined = cases[caseIndex];
  const diagramId = (data?.diagramId ?? 'convex-1') as DiagramId;

  useEffect(() => {
    if (open) {
      document.body.classList.add('lens-modal-open');
      titleRef.current?.focus({ preventScroll: true });
    } else {
      document.body.classList.remove('lens-modal-open');
    }
    return () => document.body.classList.remove('lens-modal-open');
  }, [open]);

  if (!data) return null;

  const parts = data.label.split('·');
  const caseTag = parts[0]?.trim() || `Case ${data.caseNum}`;
  const caseTitle = parts[1]?.trim() || data.object;

  return (
    <div
      id="lensModal"
      className={`lens-modal${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lensModalTitle"
      hidden={!open}
    >
      <div className="lens-modal__backdrop" data-lens-close aria-hidden onClick={onClose} />
      <div className="lens-modal__panel">
        <button className="lens-modal__close" type="button" data-lens-close aria-label="Close case study" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </button>
        <article className="lens-blog">
          <header className="lens-blog__header">
            <span className="lens-blog__tag" id="lensModalCase">{caseTag}</span>
            <h2 className="lens-blog__title" id="lensModalTitle" tabIndex={-1} ref={titleRef}>
              {caseTitle}
            </h2>
            <p className="lens-blog__summary" id="lensModalSummary">{data.summary}</p>
          </header>
          <div className="lens-blog__body">
            <div className="lens-blog__facts">
              <div className="lens-blog__fact">
                <span className="lens-blog__fact-label">Position of Object</span>
                <p id="lensModalObject">{data.object}</p>
              </div>
              <div className="lens-blog__fact">
                <span className="lens-blog__fact-label">Position of Image</span>
                <p id="lensModalImagePos">{data.imagePos}</p>
              </div>
              <div className="lens-blog__fact">
                <span className="lens-blog__fact-label">Nature of Image</span>
                <p id="lensModalNature">{data.nature}</p>
              </div>
              <div className="lens-blog__fact lens-blog__fact--wide">
                <span className="lens-blog__fact-label">Practical Application</span>
                <p id="lensModalUse">{data.use}</p>
              </div>
            </div>
            <figure className="lens-blog__figure">
              <LensModalDiagram key={diagramId} diagramId={diagramId} />
              <figcaption className="lens-blog__caption" id="lensModalCaption">
                Ray diagram — {data.object}
              </figcaption>
            </figure>
          </div>
          <footer className="lens-blog__footer">
            <button
              className="lens-blog__nav-btn"
              id="lensModalPrev"
              type="button"
              disabled={caseIndex === 0}
              onClick={() => onNavigate(-1)}
            >
              <i className="fa-solid fa-chevron-left" /> Previous
            </button>
            <span className="lens-blog__counter" id="lensModalCounter">
              {caseIndex + 1} / {cases.length}
            </span>
            <button
              className="lens-blog__nav-btn"
              id="lensModalNext"
              type="button"
              disabled={caseIndex === cases.length - 1}
              onClick={() => onNavigate(1)}
            >
              Next <i className="fa-solid fa-chevron-right" />
            </button>
          </footer>
        </article>
      </div>
    </div>
  );
}
