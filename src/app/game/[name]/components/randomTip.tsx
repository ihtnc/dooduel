"use client";

import { useEffect, useState } from "react";

const tips = [
  "Tip: You can personalise your avatar to make it uniquely yours.",
  "Tip: Pay attention to the drawing details to make accurate guesses.",
  "Tip: Practice makes perfect! The more you play, the better you'll get.",
  "Tip: The faster you guess, the more points you earn!",
  "Tip: Your score is affected by incorrect guesses. Make it count!",
  "Tip: Experiment with different drawing styles to find what works best for you.",
  "Tip: Remember, it's all about having fun and enjoying the game!",
  "Tip: Try drawing with your non-dominant hand for a goofy round!",
  "Tip: Add a silly hat or accessory to everything you draw for some instant fun!",
  "Tip: Start with big, simple shapes then refine details after.",
  "Tip: When drawing, add one distinctive detail instead of many small details.",
  "Tip: Use brush size and colors to convey depth and emphasis.",
  "Tip: Avoid drawing the answer directly. Where's the fun in that?",
  "Tip: Don't forget to send your reactions before the time runs out!",
  "Tip: There are no erase or undo buttons, so make each stroke count!",
];

export default function RandomTip() {
  const [tipIdx, setTipIdx] = useState<number>(Math.floor(Math.random() * tips.length));

  useEffect(() => {
    let lastIdx = tipIdx;

    const pickNewIdx = () => {
      if (tips.length <= 1) { return 0; }

      let newIdx = Math.floor(Math.random() * tips.length);
      // avoid immediate repeat
      if (newIdx === lastIdx) { newIdx = (newIdx + 1) % tips.length; }
      lastIdx = newIdx;
      return newIdx;
    };

    // change tip every 20 seconds
    const interval = setInterval(() => {
      setTipIdx(pickNewIdx());
    }, 20000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="text-center">
      {tips[tipIdx]}
    </span>
  );
};