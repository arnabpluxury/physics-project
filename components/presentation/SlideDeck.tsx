'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState, useRef } from 'react';
import { ChibiCharacter } from './ChibiCharacter';

export const SLIDE_COUNT = 13;

type SlideDeckProps = {
  activeIndex: number;
  onLensRowClick?: (slideId: string, caseNum: string, index: number) => void;
  activeLensRow?: { slideId: string; index: number } | null;
  rayDiagramSlot?: ReactNode;
};

export function SlideDeck({ activeIndex, onLensRowClick, activeLensRow, rayDiagramSlot }: SlideDeckProps) {
  const [creditsStarted, setCreditsStarted] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
    const [logosVisible, setLogosVisible] = useState(false);
    const creditsRollRef = useRef<HTMLDivElement | null>(null);
    const [currentLogoIndex, setCurrentLogoIndex] = useState<number>(0);
    const [logoCycleDone, setLogoCycleDone] = useState(false);

    const logos = useMemo(
      () => [
        { src: encodeURI('/next-js-logo-next-js.gif'), alt: 'Next.js animated logo', caption: 'Animation engine made in Next.js', dur: 4500 },
        { src: encodeURI('/7 Best Figma Plugins for Designers to Enhance Workflow _.jpg'), alt: 'Figma banner design', caption: 'Designed in Figma', dur: 4200 },
        { src: encodeURI('/buywikilinks-wikipedia.gif'), alt: 'Wikipedia research animation', caption: 'Content from Wikipedia', dur: 4200 }
      ],
      []
    );

  useEffect(() => {
    if (activeIndex === 12) {
      setCreditsStarted(true);
      setReloadKey((prev) => prev + 1);
      setLogosVisible(false);
      setCurrentLogoIndex(0);
      setLogoCycleDone(false);
    } else {
      setCreditsStarted(false);
    }
  }, [activeIndex]);

  // Fast-test: immediately show logos when credits start in fast mode
    useEffect(() => {
        if (!creditsStarted) return;
        if (typeof window === 'undefined') return;
        if (document.body.classList.contains('fast-credits')) {
            setLogosVisible(true);
        }
    }, [creditsStarted]);

    // Fallback: if animationend doesn't fire (reduced-motion or other), reveal logos after expected duration
    useEffect(() => {
        if (!creditsStarted) return;
        if (typeof window === 'undefined') return;
        const isFast = document.body.classList.contains('fast-credits');
        const timeoutMs = isFast ? 7000 : 39000;
        const t = setTimeout(() => setLogosVisible(true), timeoutMs + 800);
        return () => clearTimeout(t);
    }, [creditsStarted]);

    // Cycle logos when logosVisible becomes true
    useEffect(() => {
        if (!logosVisible) return;
        setLogoCycleDone(false);
        setCurrentLogoIndex(0);
        let cancelled = false;
        const timeouts: number[] = [];
        let elapsed = 0;

        logos.forEach((logo, index) => {
            const timer = window.setTimeout(() => {
                if (!cancelled) {
                    setCurrentLogoIndex(index);
                }
            }, elapsed);
            timeouts.push(timer);
            elapsed += logo.dur;
        });

        const doneTimer = window.setTimeout(() => {
            if (!cancelled) {
                setLogoCycleDone(true);
            }
        }, elapsed);
        timeouts.push(doneTimer);

        return () => {
            cancelled = true;
            timeouts.forEach((t) => window.clearTimeout(t));
        };
    }, [logosVisible, logos]);

    // Expose current index for debugging and add defensive interval to advance if needed
    useEffect(() => {
        // @ts-ignore - expose for dev console
        (window as any).__CURRENT_LOGO_INDEX__ = currentLogoIndex;
        let guard: number | undefined;
        if (logosVisible) {
            guard = window.setInterval(() => {
                // if no visible item found in DOM, advance index to trigger rerender
                const items = Array.from(document.querySelectorAll('.slide--thank-you .logo-item'));
                const anyVisible = items.some((it) => window.getComputedStyle(it as Element).visibility === 'visible');
                if (!anyVisible) {
                    setCurrentLogoIndex((v) => Math.min(v + 1, logos.length - 1));
                }
            }, 1200);
        }
        return () => { if (guard) clearInterval(guard); };
    }, [currentLogoIndex, logosVisible, logos.length]);

    // Dev helper: add a body class when URL contains ?fast=1 to speed up credit timings for testing
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isFast = window.location.search.includes('fast=1');
        if (isFast) document.body.classList.add('fast-credits');
        return () => {
            if (isFast) document.body.classList.remove('fast-credits');
        };
    }, []);

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
      {/* Slide 1 */}
      <div className={`slide slide--title ${activeIndex === 0 ? 'active' : ''}`} id="slide-1">
              <div className="title-card">
                  <h1>Refraction of Light: The Illusion of Bending</h1>
                  <p className="title-sub">Refraction ·</p>
                  <p className="title-tagline">Welcome to our presentation on the Refraction of Light.</p>
                  <p className="title-intro">Light usually travels in a straight line, but only when it&apos;s in the same medium.</p>
                  <p className="title-intro">What happens when it jumps from air to glass, or water to air? <strong>It bends.</strong></p>
                  <div className="title-meta">
                      <div className="title-logo">
                          <Image src="/assets/smi_logo.png" alt="SMI school logo" width={96} height={96} />
                      </div>
                      <div className="title-meta-text">
                          <p className="title-meta-label">Presented to</p>
                          <p className="title-meta-value">Durba Paul</p>
                      </div>
                  </div>
              </div>
              <ChibiCharacter src="/assets/levi.png" alt="Levi character" position="bottom-right" size="medium" />
              <div className="slide-footer">
                  <span className="slide-number">01 / 13</span>
              </div>
          </div>
      
          

      {/* Slide 2 */}
      <div className={`slide ${activeIndex === 1 ? 'active' : ''}`} id="slide-2">
              <div className="slide-header">
                  <h2 className="slide-title">What is Refraction?</h2>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead"><strong>What it is:</strong> Refraction is the bending of a light wave as it passes from one transparent medium into another.</p>
                          <p><strong>The Boundary Effect:</strong> This deviation occurs precisely at the interface (surface boundary) separating the two materials.</p>
                          <p><strong>The Physics Reality:</strong> It is a directional change forced by a sudden change in velocity. When light alters its speed, its trajectory is forced to bend.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">What Actually Changes?</span>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>Speed &amp; Wavelength Change:</strong> Both the speed of the light wave and its wavelength decrease or increase depending on the material.</li>
                              <li><strong>Frequency Stays Constant:</strong> The frequency of the light wave (and therefore its color) never changes during refraction.</li>
                          </ul>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Key Terminology</span>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>Incident Ray:</strong> The incoming ray of light approaching the boundary.</li>
                              <li><strong>Refracted Ray:</strong> The bent ray of light traveling through the second medium.</li>
                              <li><strong>The Normal Line:</strong> An imaginary perpendicular line (90°) drawn to the surface at the point of impact, used to measure the angles of bending (∠i and ∠r).</li>
                          </ul>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/whatisrefraction.png" alt="Refraction diagram showing incident ray, refracted ray, normal line, and angles of incidence and refraction" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">Refraction at a Boundary</span>
                              Light bends at the interface between two media — incident ray (θ₁), refracted ray (θ₂), and the normal.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">02 / 13</span>
              </div>
              <ChibiCharacter src="/assets/mikasa.png" alt="Mikasa character" position="bottom-left" size="small" />
          </div>
      
          

      {/* Slide 3 */}
      <div className={`slide ${activeIndex === 2 ? 'active' : ''}`} id="slide-3">
              <div className="slide-header">
                  <h2 className="slide-title">Why Does Light Bend?</h2>
                  <span className="slide-subtitle">Foundation</span>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead">Light bends because it changes speed when passing from one material (medium) into another.</p>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>Speed of Light isn&apos;t Constant:</strong> While light travels at its maximum speed (3 × 10⁸ m/s) in a vacuum, it slows down when passing through transparent materials like water, glass, or plastic.</li>
                              <li><strong>Optical Density:</strong> Different materials have different &quot;optical densities.&quot; The higher the optical density, the more it slows the light down.</li>
                              <li><strong>Oblique Incidence:</strong> Bending only happens if the light hits the boundary between two materials at an angle. If it hits straight on (at 90°), it slows down but doesn&apos;t bend.</li>
                          </ul>
                      </div>
                      <div className="content-section">
                          <span className="section-label">The Rules of Bending (Refraction)</span>
                          <p><strong>Entering a Denser Medium (e.g., Air to Glass):</strong></p>
                          <ul className="scout-list scout-list--compact">
                              <li>Light slows down.</li>
                              <li>It bends <strong>towards</strong> the normal (an imaginary perpendicular line to the surface).</li>
                          </ul>
                          <p><strong>Entering a Rarer Medium (e.g., Glass to Air):</strong></p>
                          <ul className="scout-list scout-list--compact">
                              <li>Light speeds up.</li>
                              <li>It bends <strong>away</strong> from the normal.</li>
                          </ul>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/whylightbends.png" alt="Wavefront pivot diagram showing why light bends as it enters water from air" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">The Wavefront Pivot</span>
                              Wavefronts with varying speeds on different sides force a directional pivot — v₁ &gt; v₂ at the boundary.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">03 / 13</span>
              </div>
              <ChibiCharacter src="/assets/hange.png" alt="Hange character" position="top-right" size="small" />
          </div>
      
          

      {/* Slide 4 */}
      <div className={`slide ${activeIndex === 3 ? 'active' : ''}`} id="slide-6">
              <div className="slide-header">
                  <h2 className="slide-title">The Shift: Lateral Displacement</h2>
                  <span className="slide-subtitle">Main Topic</span>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead">Lateral displacement is the perpendicular distance between the original path of the incident ray (if it had continued in a straight line) and the emergent ray coming out of the glass slab.</p>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>The Parallel Edge Rule:</strong> This phenomenon happens specifically when light passes through a medium with parallel faces (like a rectangular glass slab).</li>
                              <li><strong>The Core Outcome:</strong> Because the entry and exit surfaces are perfectly parallel, the net bending is zero. The light ray doesn&apos;t change its ultimate direction; it simply undergoes a sideways shift.</li>
                              <li><strong>Key Equation of Angles:</strong> The angle of incidence (∠i) is always exactly equal to the angle of emergence (∠e), meaning the initial ray and the final ray run perfectly parallel to each other.</li>
                          </ul>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Step-by-Step Optical Journey</span>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>The First Shift (Air → Glass):</strong> As the light ray strikes the upper surface, it transitions from an optically rarer medium to a denser medium. It slows down and bends towards the normal.</li>
                              <li><strong>The Internal Path:</strong> The light travels through the interior of the glass block in a straight line as the refracted ray.</li>
                              <li><strong>The Second Shift (Glass → Air):</strong> Upon reaching the bottom parallel surface, the light exits back into the air (denser to rarer medium). It speeds up and bends away from the normal by the exact same angle it originally bent inward.</li>
                          </ul>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/lateraldisplace.png" alt="Lateral displacement diagram showing incident ray, emergent ray, and perpendicular shift through a glass slab" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">Lateral Displacement (d)</span>
                              Incident and emergent rays stay parallel — the sideways shift is the perpendicular distance <em>d</em> between their paths.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">04 / 13</span>
              </div>
              <ChibiCharacter src="/assets/eren.png" alt="Eren character" position="top-left" size="medium" />
          </div>
      
          

      {/* Slide 5 */}
      <div className={`slide ${activeIndex === 4 ? 'active' : ''}`} id="slide-7">
              <div className="slide-header">
                  <h2 className="slide-title">Effects of Refraction of Light</h2>
                  <span className="slide-subtitle">Main Topic</span>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead">This classic illusion is a direct result of refraction, which is the bending of light as it passes from one medium into another. When a stick is partially placed in water, the light reflecting off the underwater portion has to cross the boundary from water into the air to reach your eyes.</p>
                          <p>Because water is optically denser than air, the light rays suddenly speed up the exact millisecond they exit the surface. This sudden acceleration forces the light rays to bend <strong>away from the normal</strong> (the imaginary perpendicular line relative to the water&apos;s surface).</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">The Brain&apos;s Illusion</span>
                          <p>The real trick, however, happens inside your brain. The human visual system is hardwired to assume that light always travels in a perfectly straight line. Your brain cannot perceive that the light bent at the surface, so it traces the incoming, bent rays straight backward.</p>
                          <p>This creates a <strong>virtual image</strong> of the underwater stick that is visually lifted and shifted closer to the surface than it actually is. Because the part of the stick in the air is seen normally while the underwater section is visually raised, the stick appears sharply bent right at the water line.</p>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/bendingofstick.png" alt="Refraction diagram showing light bending at the boundary between two media" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">Refraction at the Boundary</span>
                              Light speeds up leaving water and bends away from the normal — the physics behind the bent-stick illusion.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">05 / 13</span>
              </div>
              <ChibiCharacter src="/assets/historia.png" alt="Historia character" position="bottom-right" size="small" />
          </div>
      
          

      {/* Slide 6 */}
      <div className={`slide ${activeIndex === 5 ? 'active' : ''}`} id="slide-8">
              <div className="slide-header">
                  <h2 className="slide-title">The First Law of Refraction</h2>
                  <span className="slide-subtitle">Main Topic</span>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead">The First Law of Refraction states that the incident ray, the refracted ray, and the normal drawn at the point of incidence all lie in the <strong>same plane</strong>. This law describes the geometric relationship between the rays of light and the normal when light passes from one transparent medium to another.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Glass Slab Experiment</span>
                          <p>In this experiment, a rectangular glass slab is used to study the phenomenon of refraction. A narrow beam of light is directed towards one surface of the glass slab. The light ray traveling through air is known as the <strong>incident ray</strong>. Upon entering the glass slab, the light changes its direction due to the difference in optical density between air and glass. The ray traveling inside the glass slab is known as the <strong>refracted ray</strong>.</p>
                          <p>A normal is drawn at the point where the incident ray strikes the surface of the glass slab. Careful observation of the ray diagram shows that the incident ray, the refracted ray, and the normal all lie in the same plane. This verifies the First Law of Refraction.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Why It Matters</span>
                          <p>The law is important because it helps in understanding how light behaves when it travels between different media. It forms the foundation for the study of optical devices such as lenses, prisms, microscopes, telescopes, cameras, and optical fibers. The verification of this law using a rectangular glass slab demonstrates that the path of light during refraction follows a definite and predictable pattern, which is essential in the field of optics.</p>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/firstlaw.png" alt="First Law of Refraction diagram with incident ray, refracted ray, and normal in the same plane through a glass slab" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">First Law Verified</span>
                              Incident ray, refracted ray, and normal at the point of incidence all lie in the same plane.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">06 / 13</span>
              </div>              <ChibiCharacter src="/assets/erenjeager.png" alt="Eren Jeager character" position="top-right" size="medium" />          </div>
      
          

      {/* Slide 7 */}
      <div className={`slide ${activeIndex === 6 ? 'active' : ''}`} id="slide-9">
              <div className="slide-header">
                  <h2 className="slide-title">The Second Law (Snell&apos;s Law)</h2>
                  <span className="slide-subtitle">Main Topic</span>
              </div>
              <div className="content-grid content-grid--diagram content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <div className="content-section">
                          <p className="section-lead">Snell&apos;s Law is basically the math that tells us exactly how much light bends when it crosses between two different materials, like air and water. While refraction is the <em>what</em>, Snell&apos;s Law is the <em>how much</em>.</p>
                          <div className="formula-box formula-box--compact">
                              Snell&apos;s Law:
                              <span>n₁ sin θ₁ = n₂ sin θ₂</span>
                          </div>
                          <p>Here, <strong>n₁</strong> and <strong>n₂</strong> are the refractive indices — a measure of how much a material slows down light — and <strong>θ₁</strong> and <strong>θ₂</strong> are the angles of the light rays measured from the normal line.</p>
                      </div>
                      <div className="content-section">
                          <p>Basically, if light enters a denser medium (like water), it slows down and bends <strong>toward</strong> the normal line; if it enters a rarer medium (like air), it speeds up and bends <strong>away</strong> from that line. This behavior is incredibly consistent, which is exactly why the math holds up every single time. It&apos;s almost like light is following a set of strict traffic rules for different types of terrain.</p>
                          <p>Mastering these rules allows us to manipulate light paths to create amazing things like high-end microscopes, precision lasers, and cinema projectors. Without this equation, we wouldn&apos;t have the optical technology that shapes how we see the world today.</p>
                      </div>
                  </div>
                  <div className="visual-container visual-container--diagram">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image src="/assets/snellslaw.png" alt="Snell&apos;s Law diagram showing light refracting from air into water with angles θ₁ and θ₂" width={760} height={570} />
                          </div>
                          <figcaption className="dossier-caption">
                              <span className="dossier-caption__label">Snell&apos;s Law of Refraction</span>
                              Light changes direction at the boundary — θ₁ in air, θ₂ in water, governed by n₁ sin θ₁ = n₂ sin θ₂.
                          </figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">07 / 13</span>
              </div>
          </div>
      
          

      {/* Slide 8 */}
      <div className={`slide ${activeIndex === 7 ? 'active' : ''}`} id="slide-10">
              <div className="slide-header">
                  <h2 className="slide-title">Refraction by Spherical Lenses</h2>
                  <span className="slide-subtitle">Foundation</span>
              </div>
              <div className="content-grid content-grid--dense">
                  <div className="text-block text-block--dossier text-block--compact">
                      <p>Spherical lenses are basically curved glass tools designed to bend light. Because light normally travels in a straight line, we use the specific shape of these lenses to force it into a new path. There are two main types.</p>
                      <p><strong>Convex lenses</strong> are thicker in the middle and act like a funnel; they take incoming light rays and bring them together to a single, sharp focus point, which is exactly how magnifying glasses and human eyes work.</p>
                      <p>On the other hand, <strong>concave lenses</strong> are thinner in the middle and thicker at the edges, which causes light rays to spread apart instead of coming together. This is crucial for things like eyeglasses that need to correct specific vision issues.</p>
                      <p>By changing the curve, we control exactly where the light goes, which is the core secret behind cameras, telescopes, and how we see the world.</p>
                      <div className="content-section">
                          <span className="section-label">Lens Types & Applications</span>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>Convex Lenses:</strong> Thicker at the center, these act as &quot;converging&quot; lenses by focusing light to a specific point.</li>
                              <li><strong>Concave Lenses:</strong> Thinner at the center, these act as &quot;diverging&quot; lenses by spreading light rays out.</li>
                              <li><strong>Real-world Application:</strong> These lenses are the fundamental technology behind cameras, microscopes, telescopes, and corrective eyewear.</li>
                          </ul>
                      </div>
                  </div>
                  <div className="visual-container visual-container--notes">
                      <div className="text-block text-block--dossier text-block--accent">
                          <span className="section-label">Ray Rules</span>
                          <ul className="scout-list scout-list--compact">
                              <li><strong>Rule 1:</strong> Any light ray traveling parallel to the principal axis will refract through the lens and pass through the focus (in a convex lens) or appear to diverge from the focus (in a concave lens).</li>
                              <li><strong>Rule 2:</strong> Any light ray passing directly through the optical center of the lens will continue on the other side without bending or changing direction at all.</li>
                              <li><strong>Rule 3:</strong> Any light ray passing through the focus (for convex) or directed toward the focus (for concave) will emerge from the lens traveling parallel to the principal axis.</li>
                          </ul>
                      </div>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">08 / 13</span>
              </div>
              <ChibiCharacter src="/assets/mikasa.png" alt="Mikasa character" position="top-left" size="small" />
          </div>
      
          

      {/* Slide 9 */}
      <div className={`slide ${activeIndex === 8 ? 'active' : ''}`} id="slide-concave" data-lens-chart>
              <div className="slide-header">
                  <h2 className="slide-title">Formation Of Images By Concave Lens</h2>
                  <span className="slide-subtitle">Reference Chart · Diverging Lens</span>
              </div>
              <div className="content-grid content-grid--chart-only">
                  <div className="chart-panel chart-panel--full">
                      <table className="dossier-table" aria-label="Concave lens image formation by object position">
                          <thead>
                              <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Position of Object</th>
                                  <th scope="col">Position of Image</th>
                                  <th scope="col">Nature of Image</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr {...lensRowProps('slide-concave', '1', 0)} data-lens-case="1"
                                  data-lens-diagram="concave-1"
                                  data-lens-label="Case 1 · Between O and Infinity"
                                  data-lens-caption="Virtual, erect, diminished image — eyeglasses for myopia correction."
                                  data-lens-alt="Ray diagram: concave lens object between optical centre and infinity">
                                  <td className="case-num">1</td>
                                  <td>Between Optical Center (O) and Infinity (Any finite distance)</td>
                                  <td>Between Focus (F₁) and Optical Center (O)</td>
                                  <td>Virtual, Erect, Diminished</td>
                              </tr>
                              <tr {...lensRowProps('slide-concave', '2', 1)} data-lens-case="2"
                                  data-lens-diagram="concave-2"
                                  data-lens-label="Case 2 · At Infinity"
                                  data-lens-caption="Virtual, erect, highly diminished point-sized image at F₁ — security peepholes."
                                  data-lens-alt="Ray diagram: concave lens object at infinity">
                                  <td className="case-num">2</td>
                                  <td>At Infinity</td>
                                  <td>At Focus (F₁)</td>
                                  <td>Virtual, Erect, Highly Diminished (Point-sized)</td>
                              </tr>
                          </tbody>
                      </table>
                      <p className="chart-hint">Click any row or press <kbd>1</kbd>–<kbd>2</kbd> to open an animated ray diagram case study</p>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">09 / 13</span>
              </div>
          </div>
      
          

      {/* Slide 10 */}
      <div className={`slide ${activeIndex === 9 ? 'active' : ''}`} id="slide-11" data-lens-chart>
              <div className="slide-header">
                  <h2 className="slide-title">Formation Of Images By Convex Lens</h2>
                  <span className="slide-subtitle">Reference Chart</span>
              </div>
              <div className="content-grid content-grid--chart-only">
                  <div className="chart-panel chart-panel--full">
                      <table className="dossier-table" aria-label="Convex lens image formation by object position">
                          <thead>
                              <tr>
                                  <th scope="col">#</th>
                                  <th scope="col">Position of Object</th>
                                  <th scope="col">Position of Image</th>
                                  <th scope="col">Nature of Image</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr {...lensRowProps('slide-11', '1', 0)} data-lens-case="1"
                                  data-lens-diagram="convex-1"
                                  data-lens-label="Case 1 · Between O and F₁"
                                  data-lens-caption="Virtual, erect, magnified image — magnifying glass / simple microscope."
                                  data-lens-alt="Ray diagram: object between optical centre and focus">
                                  <td className="case-num">1</td>
                                  <td>Between O and F₁</td>
                                  <td>Same side as object (Behind lens)</td>
                                  <td>Virtual, Erect, Magnified</td>
                              </tr>
                              <tr {...lensRowProps('slide-11', '2', 1)} data-lens-case="2"
                                  data-lens-diagram="convex-2"
                                  data-lens-label="Case 2 · At Focus (F₁)"
                                  data-lens-caption="Real, inverted, highly magnified image at infinity — searchlights and car headlights."
                                  data-lens-alt="Ray diagram: object at principal focus">
                                  <td className="case-num">2</td>
                                  <td>At Focus (F₁)</td>
                                  <td>At Infinity</td>
                                  <td>Real, Inverted, Highly Magnified</td>
                              </tr>
                              <tr {...lensRowProps('slide-11', '3', 2)} data-lens-case="3"
                                  data-lens-diagram="convex-3"
                                  data-lens-label="Case 3 · Between F₁ and 2F₁"
                                  data-lens-caption="Real, inverted, magnified image beyond 2F₂ — cinema projectors."
                                  data-lens-alt="Ray diagram: object between focus and twice the focus">
                                  <td className="case-num">3</td>
                                  <td>Between F₁ and 2F₁</td>
                                  <td>Beyond 2F₂</td>
                                  <td>Real, Inverted, Magnified</td>
                              </tr>
                              <tr {...lensRowProps('slide-11', '4', 3)} data-lens-case="4"
                                  data-lens-diagram="convex-4"
                                  data-lens-label="Case 4 · At 2F₁"
                                  data-lens-caption="Real, inverted, same-size image at 2F₂ — photocopy machines."
                                  data-lens-alt="Ray diagram: object at twice the principal focus">
                                  <td className="case-num">4</td>
                                  <td>At 2F₁</td>
                                  <td>At 2F₂</td>
                                  <td>Real, Inverted, Same Size</td>
                              </tr>
                              <tr {...lensRowProps('slide-11', '5', 4)} data-lens-case="5"
                                  data-lens-diagram="convex-5"
                                  data-lens-label="Case 5 · Beyond 2F₁"
                                  data-lens-caption="Real, inverted, diminished image between F₂ and 2F₂ — camera lenses."
                                  data-lens-alt="Ray diagram: object beyond twice the principal focus">
                                  <td className="case-num">5</td>
                                  <td>Beyond 2F₁</td>
                                  <td>Between F₂ and 2F₂</td>
                                  <td>Real, Inverted, Diminished</td>
                              </tr>
                              <tr {...lensRowProps('slide-11', '6', 5)} data-lens-case="6"
                                  data-lens-diagram="convex-6"
                                  data-lens-label="Case 6 · At Infinity"
                                  data-lens-caption="Real, inverted, highly diminished point-sized image at F₂ — solar concentrators."
                                  data-lens-alt="Ray diagram: object at infinity">
                                  <td className="case-num">6</td>
                                  <td>At Infinity</td>
                                  <td>At Focus (F₂)</td>
                                  <td>Real, Inverted, Highly Diminished (Point-sized)</td>
                              </tr>
                          </tbody>
                      </table>
                      <p className="chart-hint">Click any row or press <kbd>1</kbd>–<kbd>6</kbd> to open an animated ray diagram case study</p>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">10 / 13</span>
              </div>
          </div>
      
          

      {/* Slide 11 */}
      <div className={`slide ${activeIndex === 10 ? 'active' : ''}`} id="slide-convex-uses">
              <div className="slide-header">
                  <h2 className="slide-title">Applications Of Convex Lenses</h2>
                  <span className="slide-subtitle">Real-World Uses & Examples</span>
              </div>
              <div className="content-grid">
                  <div className="text-block text-block--dossier">
                      <div className="content-section">
                          <span className="section-label">Magnifying Glasses & Microscopes</span>
                          <p>Object placed between O and F creates <strong>virtual, magnified images</strong> for detailed inspection of tiny objects.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Cameras & Photography</span>
                          <p>Objects beyond 2F create <strong>real, diminished images</strong> on film or sensor, capturing vast landscapes in small frames.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Projectors & Cinema</span>
                          <p>Objects between F and 2F produce <strong>real, magnified images</strong>, projecting tiny slides onto massive screens.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Searchlights & Headlights</span>
                          <p>Light sources at focus point produce <strong>parallel rays</strong>, creating powerful, far-reaching beams.</p>
                      </div>
                  </div>
                  <div className="visual-container">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image
                                  src="/assets/application-of-convex-lens.jpg"
                                  alt="Convex lens applications in cameras, projectors, and optical systems"
                                  width={900}
                                  height={560}
                              />
                          </div>
                          <figcaption>Convex lenses in cameras, projectors, and optical instruments</figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">11 / 13</span>
              </div>
              <ChibiCharacter src="/assets/hange.png" alt="Hange character" position="bottom-left" size="small" />
          </div>
      
          

      {/* Slide 12 */}
      <div className={`slide slide--closing ${activeIndex === 11 ? 'active' : ''}`} id="slide-concave-uses">
              <div className="slide-header">
                  <h2 className="slide-title">Applications Of Concave Lenses</h2>
                  <span className="slide-subtitle">Real-World Uses & Examples</span>
              </div>
              <div className="content-grid">
                  <div className="text-block text-block--dossier">
                      <div className="content-section">
                          <span className="section-label">Corrective Eyeglasses (Myopia)</span>
                          <p>Concave lenses <strong>diverge light rays</strong>, helping nearsighted people focus distant objects correctly on the retina.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Peepholes & Security Doors</span>
                          <p>Creates <strong>diminished, wide-angle views</strong>, allowing occupants to see visitors without opening doors.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Telescope Eyepieces</span>
                          <p>Used in combination with convex lenses for <strong>magnified viewing of distant celestial objects</strong>.</p>
                      </div>
                      <div className="content-section">
                          <span className="section-label">Laser Beam Expanders</span>
                          <p>Diverges concentrated laser beams into <strong>broader, safer spreads</strong> for industrial applications.</p>
                      </div>
                  </div>
                  <div className="visual-container">
                      <figure className="dossier-figure">
                          <div className="dossier-frame">
                              <Image
                                  src="/assets/application-concave-lens.jpg"
                                  alt="Concave lens applications in eyeglasses, peepholes, and optical systems"
                                  width={900}
                                  height={560}
                              />
                          </div>
                          <figcaption>Concave lenses in eyeglasses, peepholes, and optical systems</figcaption>
                      </figure>
                  </div>
              </div>
              <div className="slide-footer">
                  <span className="slide-number">12 / 13</span>
              </div>
              <ChibiCharacter src="/assets/historia.png" alt="Historia character" position="bottom-left" size="medium" />
          </div>
      
          

            {/* Slide 13 - Thank You Page (simplified/balanced) */}
            <div
                key={reloadKey}
                className={`slide slide--closing slide--thank-you ${activeIndex === 12 ? 'active' : ''} ${creditsStarted ? 'credits-started' : ''} ${logosVisible ? 'logos-visible' : ''}`}
                id="slide-thank-you"
            >
                <div className="thank-you-stage">
                    <div className="credits-screen">
                        <div className="credits-screen__hero">
                            <span className="credits-screen__label">Grp Credits</span>
                            <h1 className="credits-screen__title">Thank You for Your Precious Time</h1>
                            <p className="credits-screen__subtitle">The credits roll first, then the project sources, then the final thank-you screen.</p>
                        </div>

                        <div className="credits-viewport" aria-label="Rolling movie credits">
                            <div ref={creditsRollRef} className="credits-roll" onAnimationEnd={() => setLogosVisible(true)}>
                                <div className="credits-block credits-block--title">Presentation Credits</div>
                                <div className="credits-row">
                                    <span className="credits-name">Aditya Roy</span>
                                    <span className="credits-detail">Slide Content · Slides 2-3</span>
                                </div>
                                <div className="credits-row">
                                    <span className="credits-name">Pritam Nath</span>
                                    <span className="credits-detail">Slide Content · Slides 4-5</span>
                                </div>
                                <div className="credits-row">
                                    <span className="credits-name">Chayan Nath</span>
                                    <span className="credits-detail">Research & Slide Content · Slides 6-7</span>
                                </div>
                                <div className="credits-row">
                                    <span className="credits-name">Arnab Barua</span>
                                    <span className="credits-detail">Animations, Motion Designing & Slide Content · Slides 8-9</span>
                                </div>
                                <div className="credits-row">
                                    <span className="credits-name">Subha Deb Nath</span>
                                    <span className="credits-detail">Slide Content · Slides 10</span>
                                </div>
                                <div className="credits-row">
                                    <span className="credits-name">Soumik Nath</span>
                                    <span className="credits-detail">Slide Content · Slides 11-12</span>
                                </div>
                                <div className="credits-subtitle">Class 10</div>
                                <div className="credits-endline">Thank you for Your Precious Time — keep exploring optical science.</div>
                            </div>

                            <div
                                className="logo-reveal"
                                style={{
                                    opacity: logosVisible ? 1 : 0,
                                    visibility: logosVisible ? 'visible' : 'hidden',
                                    pointerEvents: logosVisible ? 'auto' : 'none',
                                }}
                            >
                                {logos.map((logo, i) => {
                                        const semantic = ['nextjs','figma','wikipedia'][i] ?? `logo-${i}`;
                                        return (
                                    <div
                                        key={logo.src}
                                        className={`logo-item logo-item--${semantic} logo-item--rotator`}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            display: currentLogoIndex === i ? 'grid' : 'none',
                                            placeItems: 'center',
                                            opacity: 1,
                                            visibility: currentLogoIndex === i ? 'visible' : 'hidden',
                                            pointerEvents: currentLogoIndex === i ? 'auto' : 'none',
                                            transform: currentLogoIndex === i ? 'scale(1)' : 'scale(0.98)',
                                            transition: 'opacity 0.7s ease, transform 0.7s ease',
                                        }}
                                    >
                                        <div className="logo-card" style={{ width: '80vw', maxWidth: 900 }}>
                                            <div className="logo-media" style={{ position: 'relative', width: '100%', height: '60vh' }}>
                                                <Image src={logo.src} alt={logo.alt} fill unoptimized style={{ objectFit: 'contain' }} />
                                            </div>
                                            <p className="logo-caption">{logo.caption}</p>
                                        </div>
                                    </div>
                                        );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="final-screen">
                        <div className="final-moment">
                            <p className="final-greeting">THANK YOU</p>
                            <h2>For watching the full presentation.</h2>
                            <p className="final-copy">Created with care in Next.js, designed in Figma, and researched through Wikipedia.</p>
                            <div className="final-chibis">
                                <ChibiCharacter src="/assets/levi.png" alt="Levi" position="bottom-left" size="small" />
                                <ChibiCharacter src="/assets/mikasa.png" alt="Mikasa" position="bottom-center-left" size="small" />
                                <ChibiCharacter src="/assets/eren.png" alt="Eren" position="bottom-center-right" size="small" />
                                <ChibiCharacter src="/assets/hange.png" alt="Hange" position="bottom-right" size="small" />
                                <ChibiCharacter src="/assets/historia.png" alt="Historia" position="top-left" size="small" />
                                <ChibiCharacter src="/assets/erenjeager.png" alt="Eren Jeager" position="top-right" size="small" />
                            </div>
                        </div>
                    </div>

                    <div className="slide-footer hidden-footer">
                        <span className="slide-number">13 / 13</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
