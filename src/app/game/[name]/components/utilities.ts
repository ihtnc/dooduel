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

export const getInitialSubText = (playerCount: number): string => {
  const options = [
    `Heads up! ${playerCount} player${playerCount !== 1 ? 's are' : ' is'} here!`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} just hit the 'Join' button really hard.`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} just rage-quit another game and came here.`,
    `Guess who's here? ${playerCount} player${playerCount !== 1 ? 's' : ''}.`,
    `${playerCount} player${playerCount !== 1 ? 's think' : ' thinks'} they're ready. We'll see.`,
    `The game just got interesting: ${playerCount} player${playerCount !== 1 ? 's' : ''} joined!`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} have entered the chat... er, game! I mean, game!`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} just joined. No pressure, right?`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} are also reading this message.`,
    `${playerCount} player${playerCount !== 1 ? 's' : ''} rolled up, ready to cause chaos!`,
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

const getNewTurnOptions = (paintersLeft: number): string[] => ([
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} waiting… patiently-ish.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} practicing by doodling in the margins.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} revving their drawing engines.`,
  `Breaking news: ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still stuck in queue.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} waiting for destiny (and their turn).`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} channeling their inner Picasso${paintersLeft !== 1 ? 's' : ''}.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} plotting a masterpiece takeover.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} waiting for their turn like pros at a theme park line.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} mastering the ancient art of patience.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} whispering 'soon... soon...'`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} stuck in the digital waiting room.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} dusting off their game faces.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} warming up their scribble muscles.`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} contemplating the mysteries of the universe (or just waiting).`,
  `${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} perfecting their doodling face.`
]);

export const getNewTurnSubText = (paintersLeft: number): string => {
  const options = getNewTurnOptions(paintersLeft);
  options.push(...[
    `The ${paintersLeft !== 1 ? `${paintersLeft} players` : 'last player'} left ${paintersLeft !== 1 ? 'are' : 'is'} sharpening their imaginary pencils.`,
    `The ${paintersLeft !== 1 ? `${paintersLeft} players` : 'last player'} left to doodle ${paintersLeft !== 1 ? 'are' : 'is'} ready. Are YOU?`,
    `The ${paintersLeft !== 1 ? `${paintersLeft} players` : 'last player'} left ${paintersLeft !== 1 ? 'are' : 'is'} meditating on the meaning of doodles.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left on standby, ready to unleash chaos.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to draw.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to make magic happen.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to turn doodles into doozies.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to create some doodle drama.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to draw their way to victory.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to unleash their inner artist.`,
    `${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to bring their wildest doodles to life.`,
    `There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is 1 player'} left to doodle.`,
    `Feels like ${paintersLeft !== 1 ? `1 of ${paintersLeft} players` : 'the last player'} is about to draw any minute now!`,
    `There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is 1 player'} left to unleash their creativity.`,
    `To think that just a minute ago, there were still ${paintersLeft + 1} players left...`
  ]);

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getNewRoundSubText = (paintersLeft: number): string => {
  const options = getNewTurnOptions(paintersLeft);
  options.push(...[
    `${paintersLeft} players are sharpening their imaginary pencils.`,
    `${paintersLeft} players are ready. Are YOU?`,
    `${paintersLeft} players are meditating on the meaning of doodles.`,
    `${paintersLeft} players are on standby, ready to unleash chaos.`,
    `There are ${paintersLeft} players waiting for their turn to draw.`,
    `${paintersLeft} players are going to make magic happen!`,
    `${paintersLeft} players will turn doodles into doozies!`,
    `There are ${paintersLeft} players eager to create some doodle drama.`,
    `${paintersLeft} players will draw their way to victory!`,
    `There are ${paintersLeft} players waiting to unleash their inner artist.`,
    `There are ${paintersLeft} players bringing their wildest doodles to life.`,
    `There are ${paintersLeft} players ready to doodle!`,
    `Feels like 1 of ${paintersLeft} players is about to draw any minute now!`,
    `${paintersLeft} players will unleash their creativity.`,
    `${paintersLeft} players have arrived!`,
  ]);

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getPainterSubText = (): string => {
  const options = [
    "Ready, set, draw!",
    "Summon your inner Picasso, draw the word!",
    "Draw or draw not, there is no try.",
    "Abstract art is still art, remember that!",
    "It's time, start doodling!",
    "Doodle like nobody's watching!",
    "Draw the word, accuracy optional!",
    "glhf!",
    "It's drawing time!",
    "Draw the word... and hope someone gets it!",
    "Time to doodle!",
    "Time is running out, start drawing!",
    "Unleash your creativity!",
    "Just doodle it!",
    "Make it snappy, the clock is ticking!",
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getGuesserSubText = (): string => {
  const options = [
    "Ready, set, guess!",
    "Channel your inner Sherlock, guess the word!",
    "You miss 100% of the guesses you don't take.",
    "Behold! A mystery! Guess it!",
    "Guess the word: badly drawn edition.",
    "Guess the word... the doodler insists it's obvious.",
    "It's guessing time!",
    "Your mission: guess the word!",
    "Guess the word and claim glory!",
    "Decipher the doodle! Guess the word!",
    "Guess the word... and hope you're right!",
    "Guess the word... or make one up!",
    "Guess the word before it guesses you!",
    "Guess before the doodle dries!",
    "Time is ticking, start guessing!",
    "Can you guess the word?",
    "Put on your thinking cap and guess!",
    "We promise it's a real word.",
    "Time to guess the word!",
    "The doodle holds the key, guess the word!",
    "Guess the word, or forever wonder!",
    "The doodle is your clue, guess the word!",
    "Start guessing!",
    "Don't overthink it, just guess!",
    "No pressure, but guess the word before time runs out!",
    "Make your guess count!",
    "Guessing: Way better than staring blankly at the doodle!",
    "Try to guess the word... or just throw out random letters!",
    "Guess the word... it's not rocket science (or is it?)",
    "The word is out there, guess it!",
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getGameCompletedSubText = (totalScore: number): string => {
  const score = Math.floor(totalScore);
  const options = [
    `Your final score: ${score}`,
    `You scored a total of ${score} points'!`,
    `${score} points earned!`,
    `${score} points! Nice!`,
    `Final tally: ${score}`,
    `${score} points! Spend them wisely (you can't).`,
    `Total score: ${score}`,
    `${score} points! Not bad for a Doodueler.`,
    `${score} points for you!`,
    `All this Doodueling earned you ${score} points!`,
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};