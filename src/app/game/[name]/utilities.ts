export const getCorrectMessage = (): string => {
  const options = [
    "Nice!",
    "Correct!",
    "Got it!",
    "Bingo!",
    "Exactly!",
    "Right on!",
    "Spot on!",
    "Yes!",
    "Bullseye!",
    "Perfect!",
    "Bravo!",
    "Well done!",
    "That's it!",
    "Nailed it!",
    "Fantastic!",
    "Great job!",
    "Genius!",
    "Impressive!",
    "Outstanding!",
    "Score!"
];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getWrongMessage = (): string => {
  const options = [
    "Nope!",
    "Wrong!",
    "Keep trying!",
    "Try again!",
    "Guess again!",
    "Not this time!",
    "Miss!",
    "Sorry!",
    "Incorrect!",
    "Sorry, no!",
    "Not correct!",
    "That's not it!",
    "Incorrect guess!",
    "Too far!",
    "No luck!"
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getCloseMessage = (): string => {
  const options = [
    "So close!",
    "Nearly there!",
    "Almost had it!",
    "Close one!",
    "That was close!",
    "Almost there!",
    "Nearly got it!",
    "Close!",
    "Almost!",
    "Very close!",
    "Almost got it!",
    "Getting warmer!",
    "Just a bit off!",
    "So near!",
    "Getting close!",
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};