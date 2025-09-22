"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import FlagButton from "@/components/button/flagButton";
import { getCurrentGame, leaveGame } from "./actions";
import type { CurrentGameDetails } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);

  const [leaveState, leaveAction, leavePending] = useActionState(leaveGame, undefined);

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
        <div className="flex flex-row gap-4">
          <div className="size-168">Canvas</div>
          <div className="flex flex-col h-168 items-center justify-between gap-4">
            <PlayerList gameId={game.id} />
            <form action={leaveAction} className="flex">
              <input type="hidden" name="game_name" value={game.name} />
              <input type="hidden" name="player_name" value={user?.player_name} />
              <input type="hidden" name="player_code" value={user?.code} />
              <FlagButton imageAlt="Leave game" className="w-50" disabled={leavePending || !user} type="submit">
                {leavePending ? "Leaving..." : "Leave"}
              </FlagButton>
              {leaveState && <div className="text-red-600">{leaveState.error}</div>}
            </form>
          </div>
        </div>
      </>}
    </div>
  );
}
