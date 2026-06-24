/* â”€â”€ Lens case ray diagram definitions + SVG builder â”€ */

export type DiagramId =
  | 'convex-1' | 'convex-2' | 'convex-3' | 'convex-4' | 'convex-5' | 'convex-6'
  | 'concave-1' | 'concave-2';

type LensType = 'convex' | 'concave';

interface ArrowCfg {
  x: number;
  top: number;
  bottom: number;
  label?: string;
  virtual?: boolean;
  inverted?: boolean;
  point?: boolean;
}

interface RayBundle {
  solid?: number[][];
  dashed?: number[][];
}

interface DiagramConfig {
  lens: LensType;
  object?: ArrowCfg;
  image?: ArrowCfg | null;
  rays: RayBundle[];
}

const CX = 240;
    const CY = 150;
    const F1 = 170;
    const F2 = 310;
    const TF1 = 100;
    const TF2 = 380;
    const RAY_LEFT = 18;
    const RAY_RIGHT = 462;
    const CV_L = 228;
    const CV_R = 252;

    const LENS_PATHS = {
        convex: `M ${CV_L} 46 C 200 80 200 220 ${CV_L} 254 C ${CX} 260 ${CV_R} 260 ${CV_R} 254 C 280 220 280 80 ${CV_R} 46 C ${CX} 40 ${CV_L} 40 ${CV_L} 46 Z`,
        concave: 'M 214 46 L 266 46 L 248 150 L 266 254 L 214 254 L 232 150 Z',
    };

    function atX(x1: number, y1: number, x2: number, y2: number, x: number): [number, number] {
        const dx = x2 - x1;
        if (Math.abs(dx) < 1e-6) return [x, y1];
        const t = (x - x1) / dx;
        return [x, y1 + t * (y2 - y1)];
    }

    function seg(x1: number, y1: number, x2: number, y2: number): number[] {
        return [x1, y1, x2, y2];
    }

    function intersect(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): [number, number] | null {
        const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(d) < 1e-9) return null;
        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)];
    }

    function ccX(y: number, side: 'left' | 'right'): number {
        const d = Math.abs(y - CY);
        const w = 16 * Math.min(d / 98, 1);
        return side === 'left' ? 232 - w : 248 + w;
    }

    function objArrow(x: number): { x: number; top: number; bottom: number } {
        return { x, top: CY - 24, bottom: CY + 2 };
    }

    function parallelConvex(y: number, endX: number = RAY_RIGHT): RayBundle {
        const [ex, ey] = atX(CV_L, y, F2, CY, endX);
        return { solid: [seg(RAY_LEFT, y, CV_L, y), seg(CV_L, y, ex, ey)], dashed: [] };
    }

    function parallelConvexEmergesHorizontal(y: number): RayBundle {
        return { solid: [seg(RAY_LEFT, y, CV_L, y), seg(CV_L, y, RAY_RIGHT, y)], dashed: [] };
    }

    function parallelConvexToPoint(y: number, ix: number, iy: number): RayBundle {
        return { solid: [seg(RAY_LEFT, y, CV_L, y), seg(CV_L, y, ix, iy)], dashed: [] };
    }

    function parallelConvexVirtual(y: number, ix: number, iy: number): RayBundle {
        const [ex, ey] = atX(CV_L, y, F2, CY, RAY_RIGHT);
        return {
            solid: [seg(RAY_LEFT, y, CV_L, y), seg(CV_L, y, ex, ey)],
            dashed: [seg(CV_L, y, ix, iy)],
        };
    }

    function throughO(ox: number, oy: number, endX: number = RAY_RIGHT): RayBundle {
        const [ex, ey] = atX(ox, oy, CX, CY, endX);
        return { solid: [seg(ox, oy, ex, ey)], dashed: [] };
    }

    function throughOToPoint(ox: number, oy: number, ix: number, iy: number): RayBundle {
        return { solid: [seg(ox, oy, ix, iy)], dashed: [] };
    }

    function throughOVirtual(ox: number, oy: number, ix: number, iy: number): RayBundle {
        const [ex, ey] = atX(ox, oy, CX, CY, RAY_RIGHT);
        return { solid: [seg(ox, oy, ex, ey)], dashed: [seg(CX, CY, ix, iy)] };
    }

    function parallelConcave(y: number): RayBundle {
        const xl = ccX(y, 'left');
        const xr = ccX(y, 'right');
        const [ex, ey] = atX(F1, CY, xr, y, RAY_RIGHT);
        return {
            solid: [seg(RAY_LEFT, y, xl, y), seg(xl, y, xr, y), seg(xr, y, ex, ey)],
            dashed: [seg(xr, y, F1, CY)],
        };
    }

    function convexVirtualImage(ox: number, oy: number, rayY: number): [number, number] | null {
        const [bx, by] = atX(F2, CY, CV_L, rayY, 12);
        return intersect(ox, oy, CX, CY, CV_L, rayY, bx, by);
    }

    function concaveVirtualImage(ox: number, oy: number, rayY: number): [number, number] | null {
        const xr = ccX(rayY, 'right');
        return intersect(ox, oy, CX, CY, F1, CY, xr, rayY);
    }

    function buildConvex1() {
        // Object between O and F: creates virtual, erect, magnified image
        const object = objArrow(205);
        const pt = convexVirtualImage(object.x, object.top, object.top)!;
        const image = { x: Math.round(pt[0]), top: Math.round(pt[1] - 18), bottom: Math.round(pt[1] + 18), virtual: true };
        return {
            lens: 'convex' as const,
            object,
            image,
            rays: [
                parallelConvexVirtual(object.top, image.x, (image.top + image.bottom) / 2),
                throughOVirtual(object.x, object.top, image.x, (image.top + image.bottom) / 2),
            ],
        };
    }

    function buildConvex2() {
        // Object at Focus: creates image at infinity
        const object = objArrow(F1);
        return {
            lens: 'convex' as const,
            object,
            image: null,
            rays: [
                parallelConvexEmergesHorizontal(object.top),
                throughO(object.x, object.top),
            ],
        };
    }

    function buildConvex3() {
        // Object between F and 2F: creates real, inverted, magnified image beyond 2F
        const object = objArrow(135);
        const image = { x: 398, top: 162, bottom: 198, virtual: false, inverted: true };
        return {
            lens: 'convex' as const,
            object,
            image,
            rays: [
                parallelConvexToPoint(object.top, image.x, image.bottom),
                throughOToPoint(object.x, object.top, image.x, image.top),
            ],
        };
    }

    function buildConvex4() {
        // Object at 2F: creates real, inverted, same-size image at 2F
        const object = objArrow(TF1);
        const image = { x: TF2, top: 162, bottom: 198, virtual: false, inverted: true };
        return {
            lens: 'convex' as const,
            object,
            image,
            rays: [
                parallelConvexToPoint(object.top, image.x, image.bottom),
                throughOToPoint(object.x, object.top, image.x, image.top),
            ],
        };
    }

    function buildConvex5() {
        // Object beyond 2F: creates real, inverted, diminished image between F and 2F
        const object = objArrow(72);
        const image = { x: 358, top: 168, bottom: 192, virtual: false, inverted: true };
        return {
            lens: 'convex' as const,
            object,
            image,
            rays: [
                parallelConvexToPoint(object.top, image.x, image.bottom),
                throughOToPoint(object.x, object.top, image.x, image.top),
            ],
        };
    }

    function buildConvex6() {
        // Object at infinity: creates real, inverted, point-sized image at F
        const y1 = CY - 18;
        const y2 = CY + 18;
        return {
            lens: 'convex' as const,
            object: { x: 38, top: y1, bottom: y2, label: 'âˆž' },
            image: { x: F2, top: CY - 2, bottom: CY + 2, virtual: false, point: true },
            rays: [
                parallelConvex(y1, F2),
                parallelConvex(y2, F2),
            ],
        };
    }

    function buildConcave1() {
        // Object anywhere: creates virtual, erect, diminished image
        const object = objArrow(190);
        const pt = concaveVirtualImage(object.x, object.top, object.top)!;
        const midY = Math.round(pt[1]);
        const image = { x: Math.round(pt[0]), top: midY - 12, bottom: midY + 12, virtual: true };
        return {
            lens: 'concave' as const,
            object,
            image,
            rays: [
                parallelConcave(object.top),
                throughO(object.x, object.top),
            ],
        };
    }

    function buildConcave2() {
        // Object at infinity: creates virtual, erect, point-sized image at F
        const y1 = CY - 18;
        const y2 = CY + 18;
        return {
            lens: 'concave' as const,
            object: { x: 30, top: y1, bottom: y2, label: 'âˆž' },
            image: { x: F1, top: CY - 2, bottom: CY + 2, virtual: true, point: true },
            rays: [
                parallelConcave(y1),
                parallelConcave(y2),
            ],
        };
    }

    const DIAGRAMS: Record<DiagramId, DiagramConfig> = {
        'convex-1': buildConvex1() as DiagramConfig,
        'convex-2': buildConvex2() as DiagramConfig,
        'convex-3': buildConvex3() as DiagramConfig,
        'convex-4': buildConvex4() as DiagramConfig,
        'convex-5': buildConvex5() as DiagramConfig,
        'convex-6': buildConvex6() as DiagramConfig,
        'concave-1': buildConcave1() as DiagramConfig,
        'concave-2': buildConcave2() as DiagramConfig,
    };

    const NS = 'http://www.w3.org/2000/svg';

    function el(name: string, attrs: Record<string, string | number> = {}): SVGElement {
        const node = document.createElementNS(NS, name);
        Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, String(v)));
        return node;
    }

    function addLine(parent: SVGElement, coords: number[], { dashed, order }: { dashed: boolean; order: number }) {
        const line = el('line', {
            x1: coords[0], y1: coords[1], x2: coords[2], y2: coords[3],
            class: `ray-draw-stroke ray-line${dashed ? ' ray-line--dashed' : ''}`,
            'data-draw-order': order,
        });
        parent.appendChild(line);
    }

    function addArrow(parent: SVGElement, cfg: ArrowCfg, order: number, virtual?: boolean) {
        const { x, top, bottom, point, inverted } = cfg;
        if (point) {
            parent.appendChild(el('circle', {
                cx: x, cy: CY, r: 5,
                class: 'ray-image-dot ray-draw-fade ray-image',
                'data-draw-order': order,
            }));
            return;
        }
        const shaft = el('line', {
            x1: x, y1: top, x2: x, y2: bottom,
            class: `ray-draw-stroke ${virtual ? 'ray-image' : 'ray-object'}`,
            'data-draw-order': order,
        });
        parent.appendChild(shaft);
        const tip = inverted ? bottom : top;
        const dir = inverted ? 1 : -1;
        parent.appendChild(el('polygon', {
            points: `${x},${tip} ${x - 6},${tip + dir * 9} ${x + 6},${tip + dir * 9}`,
            class: 'ray-arrow-head ray-draw-fade',
            'data-draw-order': order + 0.3,
        }));
    }

    function build(diagramId: DiagramId): SVGElement | null {
        const config = DIAGRAMS[diagramId];
        if (!config) return null;

        const markerId = `arrow-${diagramId.replace(/[^a-z0-9]/gi, '-')}`;
        const svg = el('svg', {
            class: 'ray-svg lens-case-svg',
            viewBox: '0 0 480 300',
            role: 'img',
            'aria-label': `Ray diagram ${diagramId}`,
        });

        const defs = el('defs');
        const marker = el('marker', {
            id: markerId, markerWidth: 8, markerHeight: 8, refX: 7, refY: 4, orient: 'auto', markerUnits: 'strokeWidth',
        });
        marker.appendChild(el('path', { d: 'M0,0 L8,4 L0,8 Z', fill: 'currentColor' }));
        defs.appendChild(marker);
        svg.appendChild(defs);

        svg.appendChild(el('line', {
            x1: RAY_LEFT, y1: CY, x2: RAY_RIGHT, y2: CY,
            class: 'ray-axis ray-draw-stroke', 'data-draw-order': 1,
        }));

        svg.appendChild(el('path', {
            d: LENS_PATHS[config.lens],
            class: `ray-lens ray-lens--${config.lens} ray-draw-stroke`,
            'data-draw-order': 2,
        }));

        let order = 3;
        const focalLabels = config.lens === 'convex'
            ? [[F1, 'Fâ‚'], [CX, 'O'], [F2, 'Fâ‚‚'], [TF1, '2Fâ‚'], [TF2, '2Fâ‚‚']]
            : [[F1, 'Fâ‚'], [CX, 'O'], [F2, 'Fâ‚‚']];

        focalLabels.forEach(([fx, label]) => {
            svg.appendChild(el('circle', {
                cx: fx, cy: CY, r: 4,
                class: 'ray-dot ray-marker ray-draw-fade',
                'data-draw-order': order,
            }));
            const text = el('text', {
                x: fx, y: CY + 20, 'text-anchor': 'middle',
                class: `ray-label ray-marker ray-draw-fade${label === 'O' ? ' ray-label--o' : ''}`,
                'data-draw-order': order + 0.1,
            });
            text.textContent = String(label);
            svg.appendChild(text);
            order += 0.2;
        });

        if (config.object) {
            addArrow(svg, config.object, 10, false);
            if (config.object.label) {
                const t = el('text', {
                    x: config.object.x - 18, y: CY - 8,
                    class: 'ray-label ray-draw-fade ray-marker',
                    'data-draw-order': 10.5,
                });
                t.textContent = config.object.label;
                svg.appendChild(t);
            }
        }

        let rayOrder = 20;
        config.rays.forEach((ray) => {
            ray.solid?.forEach((c) => {
                addLine(svg, c, { dashed: false, order: rayOrder });
                rayOrder += 1;
            });
            ray.dashed?.forEach((c) => {
                addLine(svg, c, { dashed: true, order: rayOrder + 10 });
                rayOrder += 1;
            });
        });

        if (config.image) {
            addArrow(svg, config.image, 50, config.image.virtual);
        }

        return svg;
    }

    function getIdFromRow(row: HTMLElement): DiagramId {
        const slide = row.closest('[data-lens-chart]');
        const lensType = slide?.id === 'slide-concave' ? 'concave' : 'convex';
        return `${lensType}-${row.dataset.lensCase}` as DiagramId;
    }

export const LensCaseDiagrams = { build, getIdFromRow, DIAGRAMS };
