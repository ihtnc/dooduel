"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import { getCurrentGame } from "./actions";
import type { CurrentGameDetails } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCurrentGame(name, user?.player_name || '', user?.code || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      setGame(game);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  return (
    <div className="flex flex-col align-self-start items-center mt-24">
      {pending && <div>Loading...</div>}
      {game && !pending && <>
        <GameDetails game={game} />
        <PlayerList gameId={game.id} />
      </>}
    </div>
  );
}
