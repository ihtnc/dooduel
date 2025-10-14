export const getReactionText = (): string => {
  const options = [
    "How was it?",
    "What did you think?",
    "Thoughts?",
    "Feedback:",
    "Your reaction:",
    "Rate the round!",
    "Any feedback?",
    "Send a reaction:",
    "How's the doodle?",
    "For extra points:",
    "Your thoughts?",
    "Rating:",
    "Non-violent reaction:",
    "Your take:",
    "Emoji time!",
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};