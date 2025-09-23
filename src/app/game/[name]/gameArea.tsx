"use client";

import { useEffect, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import { getWordToPaint } from "./actions";
import SubmitAnswer from "./submitAnswer";
import { GameStatus, type CurrentGameDetails, type PlayerDetails } from "@types";

const getTitle = (status: GameStatus) => {
  switch (status) {
    case GameStatus.Initial: return "Waiting for players...";
    case GameStatus.Ready: return "Get ready...";
    case GameStatus.InProgress: return "Let's Dooduel!";
    case GameStatus.Completed: return "Game over!";
  }
};

export default function GameArea({ game, player }: { game: CurrentGameDetails, player: PlayerDetails }) {
  const user = getUserContext();
  const [pending, setPending] = useState(true);
  const [wordToPaint, setWordToPaint] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWord() {
      if (player.isPainter) {
        const word = await getWordToPaint(game.id, user?.playerName || '', user?.code || '');
        setWordToPaint(word);
      } else {
        setWordToPaint(null);
      }

      setPending(false);
    }

    fetchWord();
  }, [game.id, player.isPainter, user]);

  const handleResult = (result: number) => {
  };

  return <div className="flex flex-col items-center gap-4">
    {pending && <div>Loading...</div>}
    {!pending && <>
      <div>
        <strong>
          {player.isPainter && wordToPaint}
          {!player.isPainter && getTitle(game.status)}
        </strong>
      </div>
      <div className="size-168 border-4 border-[#715A5A]">
        Canvas
      </div>
      <div className="flex w-full items-center justify-center">
        {game.status === GameStatus.Ready && <span className="h-14.5 font-bold text-xl">Doodle hard. Duel harder!</span>}
        {game.status === GameStatus.InProgress && player.isPainter && "Paint Controls"}
        {game.status === GameStatus.InProgress && !player.isPainter && !player.hasAnswered &&
          <SubmitAnswer game={game} onSubmit={handleResult} />
        }
        {game.status === GameStatus.InProgress && !player.isPainter && player.hasAnswered && "Reactions"}
        {game.status === GameStatus.Completed && "Summary"}
      </div>
    </>}
  </div>;
};