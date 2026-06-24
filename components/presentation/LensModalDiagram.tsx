'use client';

import Image from 'next/image';
import type { DiagramId } from '@/lib/lens-case-diagrams';

const DIAGRAM_IMAGES: Record<DiagramId, string> = {
  'convex-1': '/assets/convex-lens---object-between-optical-center-and-focus-(o-and-f)---teachoo.png',
  'convex-2': '/assets/convex-lens---object-at-f---teachoo.png',
  'convex-3': '/assets/convex-lens---object-beyond-f-and-2f---teachoo.png',
  'convex-4': '/assets/convex-lens-object-at-2f---teachoo.png',
  'convex-5': '/assets/convex-lens---object-beyond-2f---teachoo.png',
  'convex-6': '/assets/convex-lens-object-at-infinity---ray-diagram---teachoo.png',
  'concave-1': '/assets/concave-lens---object-between-infinity-and-optical-center---teachoo.png',
  'concave-2': '/assets/concave-lens-object-at-infinity---ray-diagram---teachoo.png',
};

export function LensModalDiagram({ diagramId }: { diagramId: DiagramId }) {
  const imagePath = DIAGRAM_IMAGES[diagramId];

  return (
    <div
      className="lens-blog__figure-frame lens-blog__figure-frame--svg"
      id="lensModalDiagramHost"
    >
      <Image
        src={imagePath}
        alt={`Ray diagram ${diagramId}`}
        width={600}
        height={400}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
}
