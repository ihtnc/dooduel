"use client";

import RandomTip from "./randomTip";
import { GameStatus, InProgressDataPayload, type CurrentGameDetails, type PlayerDetails, type RoundDataPayload } from "@types";

export default function TopBar({ game, player, roundData }: { game: CurrentGameDetails, player: PlayerDetails, roundData: RoundDataPayload | null }) {
  const renderDefault = () => <span>Let&apos;s Dooduel!</span>;

  if (!roundData) { return renderDefault(); }

  let currentRound = 0;
  let wordToPaint = "";
  if (game.status === GameStatus.InProgress) {
    const inProgressData = roundData as InProgressDataPayload;
    wordToPaint = player.isPainter ? inProgressData.word : "";
    currentRound = inProgressData.current_round;
  }

  enum ShowInfo {
    Tip,
    ForPainter,
    ForGuesser,
    GameOver,
    Default
  };

  let show = ShowInfo.Default;
  if (game.status === GameStatus.Initial || game.status === GameStatus.Ready || game.status === GameStatus.TurnEnd || game.status === GameStatus.RoundEnd) {
    show = ShowInfo.Tip;
  } else if (game.status === GameStatus.InProgress && player.isPainter && wordToPaint) {
    show = ShowInfo.ForPainter;
  } else if (game.status === GameStatus.InProgress && !player.isPainter) {
    show = ShowInfo.ForGuesser;
  } else if (game.status === GameStatus.Completed) {
    show = ShowInfo.GameOver;
  }

  return <>
    {show === ShowInfo.Tip &&
      <RandomTip />
    }
    {show === ShowInfo.ForPainter &&
      <>
        <span className="flex font-bold">Round {currentRound}:</span>
        <div className="flex items-center justify-center gap-1">Your word is <span className="font-bold text-[color:var(--primary)] font-primary-xl">{wordToPaint}</span></div>
      </>
    }
    {show === ShowInfo.ForGuesser &&
      <>
        <span className="flex font-bold">Round {currentRound}:</span>
        <span className="flex">Look at the doodle and guess the word</span>
      </>
    }
    {show === ShowInfo.GameOver &&
      <>Game over!</>
    }
    {show === ShowInfo.Default &&
      renderDefault()
    }
  </>;
};