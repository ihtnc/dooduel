"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import LeaveGame from "@/components/leaveGame";
import Loading from "@/components/loading";
import PodiumButton from "@/components/button/podiumButton";
import TrophyIcon from "@/components/icons/trophyIcon";
import { getCurrentGame, getWinner } from "./actions";
import { GameStatus, type WinnerDetails, type CurrentGameDetails } from "@types";
import { getWinnerMessage } from "./utilities";

export default function SummaryPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);
  const [winner, setWinner] = useState<WinnerDetails | null>(null);
  const [winnerText, setWinnerText] = useState<string>("");

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCurrentGame(name, user?.playerName || '', user?.code || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      if (game.status !== GameStatus.Completed) {
        router.replace(`/game/${game.name}`);
        return;
      }

      const winner = await getWinner(game.id, user?.playerName || '', user?.code || '');
      if (!winner) {
        throw new Error("Game has no winner");
      }

      setGame(game);
      setWinner(winner);
      setPending(false);
    }

    const message = getWinnerMessage();
    setWinnerText(message);
    fetchGame();
  }, [router, params, user]);

  const getWinnerDisplayName = (): string => {
    const name = winner?.name || "";
    if (name.trim().length === 0) { return "Mystery player"; }

    if (name.toLowerCase() === user?.playerName.toLowerCase()) {
      return `${name} (You)`;
    }

    return name;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {pending &&
        <div className="flex h-full">
          <Loading className="-mt-16 self-center scale-150" />
        </div>
      }
      {game && !pending && <>
        <TrophyIcon alt="Winner" className="-mt-2 scale-120" />
        <span className="text-lg font-bold">{winnerText}</span>
        <h2 className="flex flex-row items-center font-heading gap-2">
          {getWinnerDisplayName()}
        </h2>
        <h2 className="flex flex-row items-center font-primary-lg gap-2 -mt-4">
          {Math.floor(winner!.score)} points
        </h2>
        <Link href={`/leaderboard/${game.name}`}>
          <PodiumButton imageAlt="Leaderboard" className="w-50 mt-8">Leaderboard</PodiumButton>
        </Link>
        <LeaveGame game={game} />
      </>}
    </div>
  );
}
