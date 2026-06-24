export type LensCaseData = {
  caseNum: string;
  diagramId: string;
  label: string;
  summary: string;
  alt: string;
  object: string;
  imagePos: string;
  nature: string;
  use: string;
};

export function parseLensRow(row: HTMLTableRowElement): LensCaseData {
  const cells = row.querySelectorAll('td');
  return {
    caseNum: row.dataset.lensCase ?? '',
    diagramId: row.dataset.lensDiagram ?? '',
    label: row.dataset.lensLabel ?? '',
    summary: row.dataset.lensCaption ?? '',
    alt: row.dataset.lensAlt ?? '',
    object: cells[1]?.textContent?.trim() ?? '',
    imagePos: cells[2]?.textContent?.trim() ?? '',
    nature: cells[3]?.textContent?.trim() ?? '',
    use: cells[4]?.textContent?.trim() ?? '',
  };
}

export const CHART_SLIDE_IDS = ['slide-11', 'slide-concave'] as const;

export function getChartType(slideId: string): 'convex' | 'concave' {
  return slideId === 'slide-concave' ? 'concave' : 'convex';
}

export function getMaxCases(slideId: string): number {
  return slideId === 'slide-concave' ? 2 : 6;
}
