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

export const getReadySubText = (playerCount: number): string => {
  const options = [
    `${playerCount} players are waiting… patiently-ish.`,
    `${playerCount-1} other player${playerCount-1 > 1 ? 's are' : ' is'} ready. Are YOU?`,
    `${playerCount} players are on standby, ready to unleash chaos.`,
    `${playerCount} players are going to make magic happen!`,
    `There are ${playerCount} players bringing their wildest doodles to life.`,
    `There are ${playerCount} players ready to doodle!`,
    `There are ${playerCount} players plotting a masterpiece takeover.`,
    `${playerCount} players are warming up their scribble muscles.`,
    `There are ${playerCount} players perfecting their doodling face.`,
    `Feels like 1 of ${playerCount} players is about to draw any minute now!`
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getNewTurnSubText = (paintersLeft: number): string => {
  const options = [
    `By the way, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still waiting to draw... patiently-ish.`,
    `Also, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} practicing for their turn by doodling in the margins.`,
    `Note: ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} revving their drawing engines for their turn.`,
    `Breaking news: ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still stuck in the doodler queue.`,
    `But ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still waiting for destiny (and their turn to draw).`,
    `And ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} channeling their inner Picasso${paintersLeft !== 1 ? 's' : ''} for their turn.`,
    `But wait, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still plotting a masterpiece takeover...`,
    `But ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still waiting to draw like pros at a theme park line...`,
    `Hmmm... Why ${paintersLeft !== 1 ? `are those ${paintersLeft} players` : 'is that player'} whispering 'soon... soon...'?`,
    `By the way, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still stuck in the digital waiting room.`,
    `Also, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} warming up their scribble muscles for their turn.`,
    `Though ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still waiting for their turn to draw.`,
    `Meanwhile, ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} still perfecting their doodling face.`,
    `In other news: ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} dusting off their game faces for their turn.`,
    `And the ${paintersLeft !== 1 ? `${paintersLeft} players` : 'last player'} left ${paintersLeft !== 1 ? 'are' : 'is'} sharpening their imaginary pencils.`,
    `The ${paintersLeft !== 1 ? `${paintersLeft} players` : 'last player'} left to doodle ${paintersLeft !== 1 ? 'are' : 'is'} ready. Are YOU?`,
    `The ${paintersLeft !== 1 ? `${paintersLeft} doodlers` : 'last doodler'} left ${paintersLeft !== 1 ? 'are' : 'is'} meditating on the meaning of doodles.`,
    `To think that just a minute ago, there were still ${paintersLeft + 1} players left to draw...`,
    `And there ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left on standby, ready to unleash chaos.`,
    `But there ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left to draw.`,
    `Though there ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left to make magic happen.`,
    `Did you know? There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left to turn doodles into doozies.`,
    `But wait! There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left to create some doodle drama.`,
    `Breaking news: ${paintersLeft} player${paintersLeft !== 1 ? 's' : ''} left to draw their way to victory.`,
    `Hmmm... Feels like ${paintersLeft !== 1 ? `1 of ${paintersLeft} players` : 'the last player'} is about to draw any minute now!`,
    `There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is 1 player'} left to doodle though.`,
    `Note: There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is 1 player'} left to unleash their creativity.`,
    `In other news: ${paintersLeft} player${paintersLeft !== 1 ? 's are' : ' is'} yet to unleash their inner artist.`,
    `Coming up: ${paintersLeft} other player${paintersLeft !== 1 ? 's' : ''} still to bring their wildest doodles to life.`,
    `Note: There ${paintersLeft !== 1 ? `are ${paintersLeft} players` : 'is a player'} left mastering the art of waiting for their turn.`
  ];

  const idx = Math.floor(Math.random() * options.length);
  return options[idx];
};

export const getNewRoundSubText = (player_count: number): string => {
  const options = [
    `By the way, ${player_count} players are waiting for the next round... patiently-ish.`,
    `Also, ${player_count} players are practicing for the next round by doodling in the margins.`,
    `Note: ${player_count} players are revving their drawing engines for the next round.`,
    `Breaking news: ${player_count} players got stuck in the doodler queue.`,
    `${player_count} players are now waiting for their destiny (and the next round).`,
    `Next round, ${player_count} players will channel their inner Picassos.`,
    `But wait, ${player_count} players are plotting the next masterpiece takeover...`,
    `Now ${player_count} players are waiting for the next round like pros at a theme park line...`,
    `Hmmm... Why are those ${player_count} players whispering 'again... again...'?`,
    `By the way, ${player_count} players are stuck again in the digital waiting room.`,
    `Also, ${player_count} players are now warming up their scribble muscles for the next round.`,
    `${player_count} players are now waiting for their next turn to draw.`,
    `Meanwhile, ${player_count} players are perfecting their doodling face for the next round.`,
    `In other news: ${player_count} players are dusting off their game faces for the next round.`,
    `${player_count} players are now sharpening their imaginary pencils for the next round.`,
    `The ${player_count} players to doodle on the next round are ready. Are YOU?`,
    `${player_count} doodlers are meditating on the meaning of doodles before the next round.`,
    `To think that before this round started, there were about ${player_count} players...`,
    `Now ${player_count} players are on standby, ready to unleash chaos.`,
    `There are ${player_count} players waiting to draw on the next round.`,
    `Now ${player_count} players are waiting to make magic happen.`,
    `Did you know? ${player_count} players will turn doodles into doozies next round.`,
    `But wait! There are ${player_count} players to create some new doodle drama.`,
    `Breaking news: Next round, ${player_count} players will draw their way to victory.`,
    `Hmmm... Feels like 1 of ${player_count} players is about to draw any minute now!`,
    `There are ${player_count} players to doodle on the next round.`,
    `Now ${player_count} players will unleash their creativity on their next turn.`,
    `In other news: ${player_count} players are ready to unleash their inner artist. Again.`,
    `Coming up: ${player_count - 1} other player${player_count - 1 > 1 ? 's' : ''} to bring their wildest doodles to life.`,
    `Note: There are ${player_count} players mastering the art of waiting for the next round.`
  ];

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