export const getWinnerMessage = (): string => {
  const options = [
    "Congratulations!",
    "Winner Winner!",
    "Champion Doodueler",
    "Bragging rights goes to...",
    "Highest scorer:",
    "gg",
    "Victory!",
    "[Thunderous Applause]",
    "Picasso would be proud.",
    "You Win!"
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};