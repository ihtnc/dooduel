import type { GameCanvasShowcaseDetails } from "./types";

export const chooseShowcaseItems = (items: Array<GameCanvasShowcaseDetails>, maxItems: number = 6): Array<GameCanvasShowcaseDetails> => {
  if (!items || items.length === 0) return [];

  const categories = shuffleArray([
    'Hardest', 'Easiest',
    'Shortest', 'Longest', 'Fastest',
    'Minimalist', 'Colorful', 'Most Strokes',
    'Popular', 'Controversial',
    'Most Star', 'Most Love', 'Top Like',
    'Top Happy', 'Top Amused', 'Top Surprised',
    'Top Confused', 'Top Disappointed'
  ]);

  const workingSet = [...items];
  const selectedItems: Array<GameCanvasShowcaseDetails> = [];

  while(workingSet.length > 0 && selectedItems.length < maxItems) {
    // try to add the higher priority categories first
    if (chooseCategory(workingSet, selectedItems, 'Best')) { continue; }
    if (chooseCategory(workingSet, selectedItems, 'Favorite')) { continue; }

    const randomIndex = Math.floor(Math.random() * categories.length);
    const category = categories.splice(randomIndex, 1)[0];
    if (chooseCategory(workingSet, selectedItems, category)) { continue; }
  }

  return selectedItems;
};

const chooseCategory = (workingSet: Array<GameCanvasShowcaseDetails>, selectedItems: Array<GameCanvasShowcaseDetails>, category: string): boolean => {
  const index = workingSet.findIndex(item => item.category.toLowerCase() === category.toLowerCase());
  if (index === -1) { return false; }

  const item = workingSet.splice(index, 1)[0];
  const newSet = workingSet.filter(i => i.roundId !== item.roundId);
  workingSet.splice(0, workingSet.length, ...newSet);
  selectedItems.push(item);
  return true;
};

const shuffleArray = <T>(array: Array<T>): Array<T> => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
