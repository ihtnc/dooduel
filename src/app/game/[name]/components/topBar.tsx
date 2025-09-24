"use client";

import RandomTip from "./randomTip";
import { GameStatus, InProgressDataPayload, type CurrentGameDetails, type PlayerDetails, type RoundDataPayload } from "@types";

export default function TopBar({ game, player, roundData }: { game: CurrentGameDetails, player: PlayerDetails, roundData: RoundDataPayload | null }) {
  const renderDefault = () => <span>Let&apos;s Dooduel!</span>;

  if (!roundData) { return renderDefault(); }

  let wordToPaint = "";
  if (game.status === GameStatus.InProgress && player.isPainter) {
    const inProgressData = roundData as InProgressDataPayload;
    wordToPaint = inProgressData.word;
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
      <span><RandomTip /></span>
    }
    {show === ShowInfo.ForPainter &&
      <span>Your word: <strong>{wordToPaint}</strong></span>
    }
    {show === ShowInfo.ForGuesser &&
      <span>Look at the doodle and guess the word</span>
    }
    {show === ShowInfo.GameOver &&
      <span>Game over!</span>
    }
    {show === ShowInfo.Default &&
      renderDefault()
    }
  </>;
};