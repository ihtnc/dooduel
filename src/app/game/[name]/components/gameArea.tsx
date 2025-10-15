"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import Loading from "@/components/loading";
import TrophyButton from "@/components/button/trophyButton";
import MessageOverlay from "./messageOverlay";
import SubmitAnswer from "./submitAnswer";
import TopBar from "./topBar";
import GameCanvas from "./gameCanvas";
import ReadOnlyGameCanvas from "./readOnlyGameCanvas";
import BrushOptions, { DEFAULT_BRUSH } from "./brushOptions";
import { getGameRoundData } from "./actions";
import { getCloseMessage, getCorrectMessage, getWrongMessage, getGameCompletedSubText, getGuesserSubText, getInitialSubText, getPainterSubText, getNewTurnSubText, getNewRoundSubText, getReadySubText } from "./utilities";
import { GameStatus, type InitialRoundDataPayload, type ReadyRoundDataPayload, type RoundDataPayload, type CurrentGameDetails, type PlayerDetails, type RoundEndDataPayload, type GameCompletedDataPayload, type InProgressDataPayload, type TurnEndDataPayload } from "@types";
import type { Brush } from "./types";
import Reactions from "./reactions";

export default function GameArea({ game, player }: { game: CurrentGameDetails, player: PlayerDetails }) {
  const user = getUserContext();
  const [pending, setPending] = useState(true);
  const [roundData, setRoundData] = useState<RoundDataPayload | null>(null);
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [subText, setSubText] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [disableFade, setDisableFade] = useState<boolean>();
  const [fadeDelay, setFadeDelay] = useState<number>(3000);
  const [fadeDuration, setFadeDuration] = useState<number>(2000);
  const [answerSubmitted, setAnswerSubmitted] = useState<boolean>(player.hasAnswered);
  const brush = useRef<Brush>(DEFAULT_BRUSH);

  useEffect(() => {
    async function fetchRoundData() {
      const data = await getGameRoundData(game.id, user?.playerName || '', user?.code || '');
      if (!data) {
        displayMessage("Invalid game state!", { disableFade: true, subText: "Not sure how we got here..." });
        return;
      }

      let messageTitle = "";
      let subText = "";
      switch (game.status) {
        case GameStatus.Initial:
          const initialPayload = data as InitialRoundDataPayload;
          subText = getInitialSubText(initialPayload.player_count);
          displayMessage("Waiting to start...", { disableFade: true, subText });
          break;

        case GameStatus.Ready:
          const readyPayload = data as ReadyRoundDataPayload;
          messageTitle = `Round 1 of ${game.rounds}`;
          subText = getReadySubText(readyPayload.player_count);
          displayMessage("Get ready...", { disableFade: true, subText, messageTitle });
          break;

        case GameStatus.TurnEnd:
          const turnendPayload = data as unknown as TurnEndDataPayload;
          messageTitle = "Turn complete! The word was:"
          subText = getNewTurnSubText(turnendPayload.painters_left);
          displayMessage(turnendPayload.word, { disableFade: true, subText, messageTitle });
          break;

        case GameStatus.RoundEnd:
          const roundendPayload = data as RoundEndDataPayload;
          messageTitle = `Round ${roundendPayload.current_round} complete! The word was:`;
          subText = getNewRoundSubText(roundendPayload.player_count);
          displayMessage(roundendPayload.word, { disableFade: true, subText, messageTitle });
          break;

        case GameStatus.InProgress:
          const inProgressPayload = data as InProgressDataPayload;
          messageTitle = player.isPainter ? "Your turn to draw! The word is:" : "";
          const inProgressMessage = player.isPainter ? inProgressPayload.word : "Let's Dooduel!";
          subText = player.isPainter ? getPainterSubText() : getGuesserSubText();
          displayMessage(inProgressMessage, { subText, messageTitle });
          break;

        case GameStatus.Completed:
          const gameCompletedPayload = data as GameCompletedDataPayload;
          messageTitle = "Game over! The word was:";
          subText = getGameCompletedSubText(gameCompletedPayload.total_score);
          displayMessage(gameCompletedPayload.word, { disableFade: true, subText, messageTitle });
          break;
      }

      setRoundData(data);
      setPending(false);
    }

    fetchRoundData();
  }, [game.id, game.status, game.rounds, user, player.isPainter]);

  useEffect(() => {
    if (answerSubmitted !== player.hasAnswered && player.hasAnswered) {
      // the player_answered event came through
      //   this means the player submitted a correct answer
      //   so show the correct answer message
      const message = getCorrectMessage();
      displayMessage(message, { fadeDelayMs: 1500, fadeDurationMs: 1000 });
    }

    setAnswerSubmitted(player.hasAnswered);
  }, [player.hasAnswered, answerSubmitted]);

  const handleResult = useCallback((result: number) => {
    let message = "";
    if (result === 1) {
      // we don't expect this to be called
      //   since correct answers will trigger the player_answered event
      //   and that will hide the submit answer component
      //   which would then prevent this function from being called
      // but in case the event arrives late and this function gets called,
      //   we need handle it gracefully by making sure we don't show any message
      return;
    } else if (result < 1 && result > 0.5) {
      message = getCloseMessage();
    } else {
      message = getWrongMessage();
    }

    displayMessage(message, { fadeDelayMs: 1500, fadeDurationMs: 1000 });
  }, []);

  const handleBrushChange = (newBrush: Brush) => {
    brush.current = { ...newBrush };
  }

  const displayMessage = (
    message: string, {
      fadeDelayMs = 3000, fadeDurationMs = 1500, disableFade = false, messageTitle = "", subText = ""
    } : {
      fadeDelayMs?: number; fadeDurationMs?: number; disableFade?: boolean, messageTitle?: string, subText?: string
    } = {} ) => {
    setMessageTitle(messageTitle);
    setMessage(message);
    setSubText(subText);
    setFadeDelay(fadeDelayMs);
    setFadeDuration(fadeDurationMs);
    setDisableFade(disableFade);
    setShowMessage(true);
  }

  const handleFadeComplete = useCallback(() => {
    setShowMessage(false);
    setMessageTitle("");
    setMessage("");
    setSubText("");
  }, []);

  const canvasRoundId = (!pending && game.status === GameStatus.InProgress) ? (roundData as InProgressDataPayload).round_id : undefined;

  return <>
    {pending &&
      <div className="flex items-center justify-center w-full">
        <Loading className="mt-16 scale-150" />
      </div>
    }

    {!pending &&
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <TopBar game={game} player={player} roundData={roundData} />
        </div>
        <div className="size-168 border-4 border-[color:var(--primary)] rounded-xl">
          <MessageOverlay
            visible={showMessage}
            disableFade={disableFade}
            containerClassName="size-166 border-2 border-[color:var(--primary)] rounded-l"
            onFadeComplete={handleFadeComplete}
            fadeDelayMs={fadeDelay}
            fadeDurationMs={fadeDuration}
          >
            <div className="flex flex-col items-center">
              {messageTitle && <div className="text-lg font-bold mb-2">
                {messageTitle}
              </div>}
              <div className="text-[color:var(--primary)] font-primary-4xl">
                {message}
              </div>
              {subText && <div className="text-lg mt-2">
                {subText}
              </div>}
            </div>
          </MessageOverlay>
          {player.isPainter && <GameCanvas roundId={canvasRoundId} getBrush={() => brush.current} />}
          {!player.isPainter && <ReadOnlyGameCanvas gameId={game.id} roundId={canvasRoundId} />}
        </div>
        <div className="flex w-full items-center justify-center gap-4">
          {(game.status === GameStatus.Ready || game.status === GameStatus.TurnEnd || game.status === GameStatus.RoundEnd) &&
            <span className="h-14.5 font-primary-lg">Doodle fast. Guess faster!</span>
          }
          {game.status === GameStatus.InProgress && player.isPainter &&
            <BrushOptions onChange={handleBrushChange} />
          }
          {game.status === GameStatus.InProgress && !player.isPainter &&
            <Reactions roundId={canvasRoundId} collapsible={!player.hasAnswered}
              uncollapsibleClassName="w-full"
            />
          }
          {game.status === GameStatus.InProgress && !player.isPainter && !player.hasAnswered &&
            <SubmitAnswer roundId={canvasRoundId} onSubmit={handleResult} />
          }
          {game.status === GameStatus.Completed &&
            <Link href={`/summary/${game.name}`}>
              <TrophyButton className="w-50">Summary</TrophyButton>
            </Link>
          }
        </div>
      </div>
    }
  </>;
};