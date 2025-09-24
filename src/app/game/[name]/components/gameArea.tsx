"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserContext } from "@/components/userContextProvider";
import MessageOverlay from "./messageOverlay";
import SubmitAnswer from "./submitAnswer";
import TopBar from "./topBar";
import GameCanvas from "./gameCanvas";
import { getGameRoundData } from "./actions";
import { getCloseMessage, getCorrectMessage, getWrongMessage, getGameCompletedSubText, getGuesserSubText, getInitialSubText, getPainterSubText, getNewTurnSubText, getNewRoundSubText } from "./utilities";
import { GameStatus, type InitialRoundDataPayload, type ReadyRoundDataPayload, type RoundDataPayload, type CurrentGameDetails, type PlayerDetails, RoundEndDataPayload, GameCompletedDataPayload, InProgressDataPayload, TurnEndDataPayload } from "@types";

export default function GameArea({ game, player }: { game: CurrentGameDetails, player: PlayerDetails }) {
  const user = getUserContext();
  const [pending, setPending] = useState(true);
  const [roundData, setRoundData] = useState<RoundDataPayload | null>(null);
  const [message, setMessage] = useState<string>("");
  const [subText, setSubText] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [disableFade, setDisableFade] = useState<boolean>();
  const [fadeDelay, setFadeDelay] = useState<number>(3000);
  const [fadeDuration, setFadeDuration] = useState<number>(2000);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(player.hasAnswered);

  useEffect(() => {
    async function fetchRoundData() {
      const data = await getGameRoundData(game.id, user?.playerName || '', user?.code || '');
      if (!data || game.status !== data.status) {
        displayMessage("Invalid game state!", { disableFade: true, subText: "Not sure how we got here..." });
        return;
      }

      let subText = "";
      switch (game.status) {
        case GameStatus.Initial:
          const initialPayload = data as InitialRoundDataPayload;
          subText = getInitialSubText(initialPayload.player_count);
          displayMessage("Waiting to start...", { disableFade: true, subText });
          break;

        case GameStatus.Ready:
          const readyPayload = data as ReadyRoundDataPayload;
          subText = getNewRoundSubText(readyPayload.painters_left);
          displayMessage("Get ready...", { disableFade: true, subText });
          break;

        case GameStatus.TurnEnd:
          const turnendPayload = data as TurnEndDataPayload;
          subText = getNewTurnSubText(turnendPayload.painters_left);
          displayMessage("Turn complete! However...", { disableFade: true, subText });
          break;

        case GameStatus.RoundEnd:
          const roundendPayload = data as RoundEndDataPayload;
          subText = getNewRoundSubText(roundendPayload.painters_left);
          displayMessage(`Get ready for round ${roundendPayload.next_round}!`, { disableFade: true, subText });
          break;

        case GameStatus.InProgress:
          setAnswerSubmitted(false);
          const inProgressPayload = data as InProgressDataPayload;
          const inProgressMessage = player.isPainter ? `Your turn! The word is: ${inProgressPayload.word}` : "Let's Dooduel!";
          subText = player.isPainter ? getPainterSubText() : getGuesserSubText();
          displayMessage(inProgressMessage, { subText });
          break;

        case GameStatus.Completed:
          const gameCompletedPayload = data as GameCompletedDataPayload;
          subText = getGameCompletedSubText(gameCompletedPayload.total_score);
          displayMessage("Game over!", { disableFade: true, subText });
          break;
      }

      setRoundData(data);
      setPending(false);
    }

    fetchRoundData();
  }, [game.id, game.status, user, player.isPainter]);

  const handleResult = useCallback((result: number) => {
    let message = "";
    if (result === 1) {
      message = getCorrectMessage();
      setAnswerSubmitted(true);
    } else if (result < 1 && result > 0.5) {
      message = getCloseMessage();
    } else {
      message = getWrongMessage();
    }

    displayMessage(message, { fadeDelayMs: 1000, fadeDurationMs: 1000 });
  }, []);

  const displayMessage = (
    message: string, {
      fadeDelayMs = 3000, fadeDurationMs = 1000, disableFade, subText = ""
    } : {
      fadeDelayMs?: number; fadeDurationMs?: number; disableFade?: boolean, subText?: string
    } = {} ) => {
    setMessage(message);
    setSubText(subText);
    setDisableFade(disableFade);
    setFadeDelay(fadeDelayMs);
    setFadeDuration(fadeDurationMs);
    setShowMessage(true);
  }

  const handleFadeComplete = useCallback(() => {
    setShowMessage(false);
    setMessage("");
    setSubText("");
  }, []);

  return <div className="flex flex-col items-center gap-4">
    {pending && <div>Loading...</div>}
    {!pending && <>
      <div>
        <TopBar game={game} player={player} roundData={roundData} />
      </div>
      <div className="size-168 border-4 border-[#715A5A]">
        <MessageOverlay
          visible={showMessage}
          disableFade={disableFade}
          containerClassName="size-166"
          onFadeComplete={handleFadeComplete}
          fadeDelayMs={fadeDelay}
          fadeDurationMs={fadeDuration}
        >
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-[#715A5A]">
              {message}
            </div>
            {subText && <div className="text-lg mt-2">
              {subText}
            </div>}
          </div>
        </MessageOverlay>
        <GameCanvas />
      </div>
      <div className="flex w-full items-center justify-center">
        {(game.status === GameStatus.Ready || game.status === GameStatus.TurnEnd || game.status === GameStatus.RoundEnd) &&
          <span className="h-14.5 font-bold text-xl">Doodle fast. Guess faster!</span>
        }
        {game.status === GameStatus.InProgress && player.isPainter && "Paint Controls"}
        {game.status === GameStatus.InProgress && !player.isPainter && !answerSubmitted &&
          <SubmitAnswer game={game} onSubmit={handleResult} />
        }
        {game.status === GameStatus.InProgress && !player.isPainter && answerSubmitted && "Reactions"}
        {game.status === GameStatus.Completed && "Summary"}
      </div>
    </>}
  </div>;
};