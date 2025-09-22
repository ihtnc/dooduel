"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import { getCreatedGame, startGame, updateAvatar } from "./actions";
import type { CreatedGameDetails } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const [update, action, startPending] = useActionState(startGame, undefined);
  const user = getUserContext();

  const [getPending, setPending] = useState(true);
  const [game, setGame] = useState<CreatedGameDetails | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCreatedGame(name, user?.player_name || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      await updateAvatar(game.id, user?.player_name || '', user?.code || '', user?.avatar || '');
      setGame(game);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  return (
    <div className="flex flex-col align-self-start items-center place-items-start mt-24 gap-4">
      {getPending && <div>Loading...</div>}
      {game && !getPending && <>
        <GameDetails game={game} />
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="creator" value={user?.player_name} />
          <input type="hidden" name="code" value={game?.code} />
          <BrushButton className="w-50" disabled={startPending || !user} type="submit" imageAlt="Start game">
            {startPending ? "Starting..." : "Start"}
          </BrushButton>
          {update && <div className="text-red-600">{update.error}</div>}
        </form>
        <PlayerList gameId={game.id} />
      </>}
    </div>
  );
}
