"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import CurrentGame from "@/components/currentGame";
import { getCreatedGame, startGame } from "./actions";
import type { CreatedGameDetails, CurrentGameDetails } from "@types";

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

      setGame(game);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  let details: CurrentGameDetails | undefined;
  if (game) {
    details = {
      name: game.name,
      rounds: game.rounds,
      difficulty: game.difficulty,
      hasPassword: game.hasPassword,
      status: "ready",
      currentRound: null,
      currentPainterName: null,
    };
  }

  return (
    <div className="flex flex-col align-self-start items-center place-items-start mt-24">
      {getPending && <div>Loading...</div>}
      {game && !getPending && <>
        <CurrentGame game={details!} />
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="creator" value={user?.player_name} />
          <input type="hidden" name="code" value={game?.code} />
          <BrushButton className="w-50" disabled={startPending || !user} type="submit" imageAlt="Start Game Icon">
            {startPending ? "Starting..." : "Start"}
          </BrushButton>
          {update && <div className="text-red-600">{update.error}</div>}
        </form>
      </>}
    </div>
  );
}
