import type { LensCaseData } from '@/lib/lens-modal';

export const CONVEX_CASES: LensCaseData[] = [
  {
    caseNum: '1',
    diagramId: 'convex-1',
    label: 'Case 1 · Between O and F₁',
    summary: 'Virtual, erect, magnified image — magnifying glass / simple microscope.',
    alt: 'Ray diagram: object between optical centre and focus',
    object: 'Between O and F₁',
    imagePos: 'Same side as object (Behind lens)',
    nature: 'Virtual, Erect, Magnified',
    use: 'Used as a simple microscope or magnifying glass to read tiny text.',
  },
  {
    caseNum: '2',
    diagramId: 'convex-2',
    label: 'Case 2 · At Focus (F₁)',
    summary: 'Real, inverted, highly magnified image at infinity — searchlights and car headlights.',
    alt: 'Ray diagram: object at principal focus',
    object: 'At Focus (F₁)',
    imagePos: 'At Infinity',
    nature: 'Real, Inverted, Highly Magnified',
    use: 'Used in searchlights and car headlights to throw a powerful parallel beam.',
  },
  {
    caseNum: '3',
    diagramId: 'convex-3',
    label: 'Case 3 · Between F₁ and 2F₁',
    summary: 'Real, inverted, magnified image beyond 2F₂ — cinema projectors.',
    alt: 'Ray diagram: object between focus and twice the focus',
    object: 'Between F₁ and 2F₁',
    imagePos: 'Beyond 2F₂',
    nature: 'Real, Inverted, Magnified',
    use: 'Used in cinema projectors to blow up a small film strip onto a massive screen.',
  },
  {
    caseNum: '4',
    diagramId: 'convex-4',
    label: 'Case 4 · At 2F₁',
    summary: 'Real, inverted, same-size image at 2F₂ — photocopy machines.',
    alt: 'Ray diagram: object at twice the principal focus',
    object: 'At 2F₁',
    imagePos: 'At 2F₂',
    nature: 'Real, Inverted, Same Size',
    use: 'Used in photocopy machines for exact 1:1 scale duplicates.',
  },
  {
    caseNum: '5',
    diagramId: 'convex-5',
    label: 'Case 5 · Beyond 2F₁',
    summary: 'Real, inverted, diminished image between F₂ and 2F₂ — camera lenses.',
    alt: 'Ray diagram: object beyond twice the principal focus',
    object: 'Beyond 2F₁',
    imagePos: 'Between F₂ and 2F₂',
    nature: 'Real, Inverted, Diminished',
    use: 'Used in standard camera lenses to fit a large landscape onto a small digital sensor.',
  },
  {
    caseNum: '6',
    diagramId: 'convex-6',
    label: 'Case 6 · At Infinity',
    summary: 'Real, inverted, highly diminished point-sized image at F₂ — solar concentrators.',
    alt: 'Ray diagram: object at infinity',
    object: 'At Infinity',
    imagePos: 'At Focus (F₂)',
    nature: 'Real, Inverted, Highly Diminished (Point-sized)',
    use: 'Used in solar concentrators or burning glasses to focus sunlight onto a single point.',
  },
];

export const CONCAVE_CASES: LensCaseData[] = [
  {
    caseNum: '1',
    diagramId: 'concave-1',
    label: 'Case 1 · Between O and Infinity',
    summary: 'Virtual, erect, diminished image — eyeglasses for myopia correction.',
    alt: 'Ray diagram: concave lens object between optical centre and infinity',
    object: 'Between Optical Center (O) and Infinity (Any finite distance)',
    imagePos: 'Between Focus (F₁) and Optical Center (O)',
    nature: 'Virtual, Erect, Diminished',
    use: 'Used in eyeglasses to correct nearsightedness (myopia) by spreading light out so the eye can focus it correctly.',
  },
  {
    caseNum: '2',
    diagramId: 'concave-2',
    label: 'Case 2 · At Infinity',
    summary: 'Virtual, erect, highly diminished point-sized image at F₁ — security peepholes.',
    alt: 'Ray diagram: concave lens object at infinity',
    object: 'At Infinity',
    imagePos: 'At Focus (F₁)',
    nature: 'Virtual, Erect, Highly Diminished (Point-sized)',
    use: 'Used in security peepholes in doors to give you a highly minimized, wide-angle view of who is outside.',
  },
];

export function getLensCases(slideId: string): LensCaseData[] {
  return slideId === 'slide-concave' ? CONCAVE_CASES : CONVEX_CASES;
}
