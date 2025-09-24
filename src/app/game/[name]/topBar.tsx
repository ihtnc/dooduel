"use client";

import { GameStatus, InProgressDataPayload, type CurrentGameDetails, type PlayerDetails, type RoundDataPayload } from "@types";
import RandomTip from "./randomTip";

export default function TopBar({ game, player, roundData }: { game: CurrentGameDetails, player: PlayerDetails, roundData: RoundDataPayload | null }) {
  if (!roundData) { return <>Let&apos;s Dooduel!</>; }

  let wordToPaint = "";

  if (game.status === GameStatus.InProgress && player.isPainter) {
    const inProgressData = roundData as InProgressDataPayload;
    wordToPaint = inProgressData.word;
  }

  return <>
    {(game.status === GameStatus.Initial || game.status === GameStatus.Ready || game.status === GameStatus.RoundEnd) &&
      <span><RandomTip /></span>
    }
    {(game.status === GameStatus.InProgress && player.isPainter && wordToPaint) &&
      <span>Your word: <strong>{wordToPaint}</strong></span>
    }
    {(game.status === GameStatus.InProgress && !player.isPainter) &&
      <span>Look at the doodle and guess the word</span>
    }
    {(game.status === GameStatus.Completed) &&
      <span>Game over!</span>
    }
  </>;
};