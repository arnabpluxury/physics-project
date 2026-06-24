export const TIMING = {
  axis: 650,
  lens: 850,
  fill: 350,
  marker: 180,
  markerGap: 70,
  object: 500,
  ray: 700,
  rayGap: 180,
  dashed: 550,
  image: 500,
} as const;

export type TimingOptions = Partial<typeof TIMING>;

export const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function prepStroke(el: SVGGeometryElement & { style: CSSStyleDeclaration; classList: DOMTokenList }) {
  const len = el.getTotalLength?.() ?? 0;
  if (!len) return;
  el.style.strokeDasharray = `${len}`;
  el.style.strokeDashoffset = `${len}`;
  el.style.transition = 'none';
  el.classList.remove('is-drawn');
}

function prepFade(el: HTMLElement) {
  el.style.transition = 'none';
  el.style.opacity = '0';
  el.classList.remove('is-visible');
}

export function resetSvg(svg: SVGSVGElement | null) {
  if (!svg) return;
  svg.classList.remove('is-complete');
  svg.querySelectorAll<SVGElement>('.ray-draw-stroke').forEach((el) => {
    if ('getTotalLength' in el) prepStroke(el as SVGGeometryElement & { style: CSSStyleDeclaration; classList: DOMTokenList });
  });
  svg.querySelectorAll<HTMLElement>('.ray-draw-fade').forEach(prepFade);
  svg.querySelectorAll<SVGElement>('.ray-lens').forEach((lens) => {
    lens.classList.remove('is-filled');
    lens.style.fillOpacity = '0';
  });
  svg.querySelectorAll<SVGLineElement>('.ray-line').forEach((line) => {
    line.removeAttribute('marker-end');
  });
}

function animateStroke(el: SVGGeometryElement & { style: CSSStyleDeclaration; classList: DOMTokenList }, duration: number) {
  return new Promise<void>((resolve) => {
    const len = el.getTotalLength?.();
    if (!len) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.classList.add('is-drawn');
      resolve();
    };
    const t = setTimeout(finish, duration + 80);
    el.addEventListener(
      'transitionend',
      (e) => {
        if (e.propertyName === 'stroke-dashoffset') {
          clearTimeout(t);
          finish();
        }
      },
      { once: true }
    );
    el.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    requestAnimationFrame(() => {
      el.style.strokeDashoffset = '0';
    });
  });
}

function animateFade(el: HTMLElement, duration: number) {
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.classList.add('is-visible');
      resolve();
    };
    const t = setTimeout(finish, duration + 80);
    el.addEventListener(
      'transitionend',
      (e) => {
        if (e.propertyName === 'opacity') {
          clearTimeout(t);
          finish();
        }
      },
      { once: true }
    );
    el.style.transition = `opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      el.style.opacity = '1';
    });
  });
}

function animateFill(lens: SVGElement, duration: number) {
  return new Promise<void>((resolve) => {
    lens.classList.add('is-filled');
    const targetOpacity = lens.classList.contains('ray-lens--concave') ? '0.72' : '1';
    lens.style.transition = `fill-opacity ${duration}ms ease`;
    requestAnimationFrame(() => {
      lens.style.fillOpacity = targetOpacity;
    });
    const t = setTimeout(resolve, duration + 60);
    lens.addEventListener(
      'transitionend',
      (e) => {
        if (e.propertyName === 'fill-opacity') {
          clearTimeout(t);
          resolve();
        }
      },
      { once: true }
    );
  });
}

function byOrder(svg: SVGSVGElement, sel: string) {
  return Array.from(svg.querySelectorAll<SVGElement>(sel)).sort(
    (a, b) => Number(a.dataset.drawOrder || 0) - Number(b.dataset.drawOrder || 0)
  );
}

export async function drawSequence(svg: SVGSVGElement | null, options: { timing?: TimingOptions } = {}) {
  const timing = { ...TIMING, ...options.timing };
  if (!svg) return;

  const axis = svg.querySelector<SVGLineElement>('.ray-axis');
  if (axis) await animateStroke(axis, timing.axis);

  const lens = svg.querySelector<SVGElement>('.ray-lens');
  if (lens) {
    await animateStroke(lens as SVGGeometryElement & { style: CSSStyleDeclaration; classList: DOMTokenList }, timing.lens);
    await animateFill(lens, timing.fill);
  }

  const markers = byOrder(svg, '.ray-marker');
  for (const m of markers) {
    await animateFade(m as unknown as HTMLElement, timing.marker);
    await wait(timing.markerGap * 0.5);
  }

  const object = svg.querySelector<SVGLineElement>('.ray-object');
  if (object) await animateStroke(object, timing.object);

  const solidRays = byOrder(svg, '.ray-line:not(.ray-line--dashed)');
  const marker = svg.querySelector('defs marker');
  for (const ray of solidRays) {
    if (marker?.id) ray.setAttribute('marker-end', `url(#${marker.id})`);
    await animateStroke(ray as SVGLineElement, timing.ray);
    await wait(timing.rayGap * 0.4);
  }

  const dashedRays = byOrder(svg, '.ray-line--dashed');
  for (const ray of dashedRays) {
    await animateStroke(ray as SVGLineElement, timing.dashed);
    ray.classList.add('is-drawn');
    await wait(timing.rayGap * 0.3);
  }

  const image = svg.querySelector<SVGLineElement>('.ray-image:not(.ray-image-dot)');
  if (image) {
    await animateStroke(image, timing.image);
    const head = svg.querySelector<SVGPolygonElement>('.ray-image ~ .ray-arrow-head, .ray-image + .ray-arrow-head');
    if (head) await animateFade(head as unknown as HTMLElement, 280);
  }

  const objHead = svg.querySelector<SVGPolygonElement>('.ray-object ~ .ray-arrow-head');
  if (objHead) await animateFade(objHead as unknown as HTMLElement, 280);

  const fades = byOrder(svg, '.ray-draw-fade:not(.ray-marker):not(.ray-arrow-head)');
  for (const el of fades) {
    await animateFade(el as unknown as HTMLElement, timing.marker);
  }

  const imageDot = svg.querySelector<SVGCircleElement>('.ray-image-dot');
  if (imageDot) await animateFade(imageDot as unknown as HTMLElement, timing.marker);

  svg.classList.add('is-complete');
}

export const DiagramDrawEngine = { resetSvg, drawSequence, TIMING, wait };
