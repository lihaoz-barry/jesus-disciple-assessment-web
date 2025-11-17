interface AssessmentItem {
  id: string;
  order_index: number;
  text_en: string;
  text_zh: string;
  section_id: string;
  section_title_en: string;
  section_title_zh: string;
}

interface Section {
  id: string;
  group_id: string;
  order_index: number;
  title_en: string;
  title_zh: string;
  items: Array<{
    id: string;
    order_index: number;
    text_en: string;
    text_zh: string;
  }>;
}

interface AssessmentData {
  sections: Section[];
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Flatten all items from sections and add section metadata
 */
export function flattenAssessmentItems(assessmentData: AssessmentData): AssessmentItem[] {
  const allItems: AssessmentItem[] = [];

  assessmentData.sections.forEach((section) => {
    section.items.forEach((item) => {
      allItems.push({
        ...item,
        section_id: section.id,
        section_title_en: section.title_en,
        section_title_zh: section.title_zh,
      });
    });
  });

  return allItems;
}

/**
 * Shuffle all assessment items
 */
export function shuffleAssessmentItems(assessmentData: AssessmentData): AssessmentItem[] {
  const allItems = flattenAssessmentItems(assessmentData);
  return shuffleArray(allItems);
}

/**
 * Group shuffled items into pages (5 items per page)
 */
export function groupItemsIntoPages(items: AssessmentItem[], itemsPerPage: number = 5): AssessmentItem[][] {
  const pages: AssessmentItem[][] = [];
  for (let i = 0; i < items.length; i += itemsPerPage) {
    pages.push(items.slice(i, i + itemsPerPage));
  }
  return pages;
}

/**
 * Calculate scores for each section based on answers
 */
export function calculateSectionScores(
  answers: Record<string, number>,
  allItems: AssessmentItem[]
): Record<string, { average: number; count: number; total: number }> {
  const sectionScores: Record<string, { total: number; count: number; average: number }> = {};

  // Initialize all sections
  allItems.forEach((item) => {
    if (!sectionScores[item.section_id]) {
      sectionScores[item.section_id] = { total: 0, count: 0, average: 0 };
    }
  });

  // Calculate totals
  Object.entries(answers).forEach(([itemId, score]) => {
    const item = allItems.find((i) => i.id === itemId);
    if (item) {
      sectionScores[item.section_id].total += score;
      sectionScores[item.section_id].count += 1;
    }
  });

  // Calculate averages
  Object.keys(sectionScores).forEach((sectionId) => {
    const section = sectionScores[sectionId];
    section.average = section.count > 0 ? section.total / section.count : 0;
  });

  return sectionScores;
}

/**
 * Get section metadata
 */
export function getSectionMetadata(assessmentData: AssessmentData): Array<{
  id: string;
  title_en: string;
  title_zh: string;
  group_id: string;
}> {
  return assessmentData.sections.map((section) => ({
    id: section.id,
    title_en: section.title_en,
    title_zh: section.title_zh,
    group_id: section.group_id,
  }));
}
