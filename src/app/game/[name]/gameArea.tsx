"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserContext } from "@/components/userContextProvider";
import FadingMessage from "@/components/fadingMessage";
import { getWordToPaint } from "./actions";
import SubmitAnswer from "./submitAnswer";
import { GameStatus, type CurrentGameDetails, type PlayerDetails } from "@types";
import { getCloseMessage, getCorrectMessage, getWrongMessage } from "./utilities";

const getTopBarMessage = (status: GameStatus) => {
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
  const [message, setMessage] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [fadeMessage, setFadeMessage] = useState<boolean>(false);

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

  useEffect(() => {
    switch (game.status) {
    case GameStatus.Initial:
      displayMessage("Waiting to start...", true);
      break;
    case GameStatus.Ready:
      displayMessage("Get ready...");
      break;
    case GameStatus.InProgress:
      displayMessage("Let's Dooduel!");
      break;
    case GameStatus.Completed:
      displayMessage("Game over!");
      break;
    }
  }, [game.status]);

  const handleResult = useCallback((result: number) => {
    let message = "";
    if (result === 1) {
      message = getCorrectMessage();
    } else if (result < 1 && result > 0.5) {
      message = getCloseMessage();
    } else {
      message = getWrongMessage();
    }

    displayMessage(message);
  }, []);

  const displayMessage = (message: string, disableFade?: boolean) => {
    setMessage(message);
    setShowMessage(true);
    setFadeMessage(!disableFade);
  }

  const handleFadeComplete = useCallback(() => {
    setShowMessage(false);
  }, []);

  return <div className="flex flex-col items-center gap-4">
    {pending && <div>Loading...</div>}
    {!pending && <>
      <div>
        <strong>
          {player.isPainter && wordToPaint}
          {!player.isPainter && getTopBarMessage(game.status)}
        </strong>
      </div>
      <div className="size-168 border-4 border-[#715A5A]">
        <FadingMessage
          visible={showMessage}
          enabled={fadeMessage}
          containerClassName="size-166"
          onFadeComplete={handleFadeComplete}
        >
          <div className="text-4xl font-bold text-[#715A5A]">
            {message}
          </div>
        </FadingMessage>
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