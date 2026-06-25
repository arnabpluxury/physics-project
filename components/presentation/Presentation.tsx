'use client';

import { getLensCases } from '@/data/lens-cases';
import { getMaxCases } from '@/lib/lens-modal';
import { useCallback, useEffect, useState } from 'react';
import { BackgroundGifAnimation } from '@/components/presentation/BackgroundGifAnimation';
import { LensModal } from './LensModal';
import { RayDiagramSlide } from './RayDiagramSlide';
import { SLIDE_COUNT, SlideDeck } from './SlideDeck';

export function Presentation() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lensModal, setLensModal] = useState<{ slideId: string; caseIndex: number } | null>(null);
  const [activeLensRow, setActiveLensRow] = useState<{ slideId: string; index: number } | null>(null);

  const progress = ((activeIndex + 1) / SLIDE_COUNT) * 100;

  const changeSlide = useCallback((direction: number) => {
    setLensModal(null);
    setActiveLensRow(null);
    setActiveIndex((i) => (i + direction + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const showSlide = useCallback((index: number) => {
    setLensModal(null);
    setActiveLensRow(null);
    setActiveIndex((index + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const openLensModal = useCallback((slideId: string, _caseNum: string, index: number) => {
    setLensModal({ slideId, caseIndex: index });
    setActiveLensRow({ slideId, index });
  }, []);

  const closeLensModal = useCallback(() => {
    setLensModal(null);
  }, []);

  const navigateLensModal = useCallback((direction: -1 | 1) => {
    setLensModal((prev) => {
      if (!prev) return prev;
      const cases = getLensCases(prev.slideId);
      const next = prev.caseIndex + direction;
      if (next < 0 || next >= cases.length) return prev;
      setActiveLensRow({ slideId: prev.slideId, index: next });
      return { ...prev, caseIndex: next };
    });
  }, []);

  const getActiveChartSlideId = useCallback((): string | null => {
    if (activeIndex === 8) return 'slide-concave';
    if (activeIndex === 9) return 'slide-11';
    return null;
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lensModal) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeLensModal();
          return;
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          navigateLensModal(-1);
          return;
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          navigateLensModal(1);
          return;
        }
        const num = parseInt(event.key, 10);
        const cases = getLensCases(lensModal.slideId);
        if (num >= 1 && num <= cases.length) {
          event.preventDefault();
          const idx = num - 1;
          setLensModal({ ...lensModal, caseIndex: idx });
          setActiveLensRow({ slideId: lensModal.slideId, index: idx });
        }
        return;
      }

      const chartId = getActiveChartSlideId();
      if (chartId) {
        const num = parseInt(event.key, 10);
        const max = getMaxCases(chartId);
        if (num >= 1 && num <= max) {
          event.preventDefault();
          openLensModal(chartId, String(num), num - 1);
          return;
        }
      }

      const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
      const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];
      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        changeSlide(1);
      } else if (prevKeys.includes(event.key)) {
        event.preventDefault();
        changeSlide(-1);
      } else if (event.key === 'Home') {
        showSlide(0);
      } else if (event.key === 'End') {
        showSlide(SLIDE_COUNT - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, changeSlide, closeLensModal, getActiveChartSlideId, lensModal, navigateLensModal, openLensModal, showSlide]);

  return (
    <>
      <SlideDeck
        activeIndex={activeIndex}
        onLensRowClick={openLensModal}
        activeLensRow={activeLensRow}
      />

      <div className="presentation-chrome" aria-hidden>
        <div className="progress-track">
          <div className="progress-fill" id="progressFill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="nav-controls">
        <span className="nav-hint">← → navigate</span>
        <button className="nav-btn" id="prevBtn" type="button" aria-label="Previous slide" onClick={() => changeSlide(-1)}>
          <i className="fa-solid fa-arrow-left" />
        </button>
        <button className="nav-btn" id="nextBtn" type="button" aria-label="Next slide" onClick={() => changeSlide(1)}>
          <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      {lensModal && (
        <LensModal
          open
          slideId={lensModal.slideId}
          caseIndex={lensModal.caseIndex}
          onClose={closeLensModal}
          onNavigate={navigateLensModal}
        />
      )}

      <BackgroundGifAnimation key={activeIndex} />
    </>
  );
}
