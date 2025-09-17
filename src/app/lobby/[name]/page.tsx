"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import { getCreatedGame, startGame } from "./actions";
import type { InitialGameDetails } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const [update, action, startPending] = useActionState(startGame, undefined);
  const user = getUserContext();

  const [getPending, setPending] = useState(true);
  const [game, setGame] = useState<InitialGameDetails | null>(null);

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

  return (
    <div className="flex flex-col items-center justify-center">
      {getPending && <div>Loading...</div>}
      {game && !getPending && <>
        <h1 className="text-2xl font-bold mb-4">Game lobby</h1>
        <div className="bg-white rounded shadow p-6 w-full max-w-lg">
          <div><strong>Name:</strong> {game.name}</div>
          <div><strong>Rounds:</strong> {game.rounds}</div>
          <div><strong>Difficulty:</strong> {game.difficulty}</div>
        </div>
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
