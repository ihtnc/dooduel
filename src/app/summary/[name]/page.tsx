"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import GameDetails from "@/components/gameDetails";
import LeaveGame from "@/components/leaveGame";
import Loading from "@/components/loading";
import PlayerList from "@/components/playerList";
import { getPlayers } from "@/components/playerList/actions";
import TrophyIcon from "@/components/icons/trophyIcon";
import { getCurrentGame } from "./actions";
import { GameStatus, type PlayerDetails, type CurrentGameDetails } from "@types";

export default function SummaryPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);
  const [players, setPlayers] = useState<Array<PlayerDetails>>([]);

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

      const players = await getPlayers(game.id, user?.playerName || '', user?.code || '');
      if (players == null) {
        router.replace("/not-found");
        return;
      }

      setGame(game);
      setPlayers(players);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  return (
    <div className="flex flex-col align-self-start items-center mt-24 gap-4">
      {pending &&
        <div className="flex h-full">
          <Loading className="-mt-16 self-center size-20" />
        </div>
      }
      {game && !pending && <>
        <GameDetails game={game} />
        <div className="flex flex-row items-center font-bold font-subheading gap-2">
          <TrophyIcon alt="Leaderboard" className="-mt-2" />
          Leaderboard
        </div>
        <PlayerList players={players}
          sortByScore={true}
          hightlightCurrentPlayer={true}
          addRowNumber={true}
        />
        <LeaveGame game={game} className="mt-8" />
      </>}
    </div>
  );
}
