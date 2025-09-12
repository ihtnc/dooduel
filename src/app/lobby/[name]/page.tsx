"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {getPending && <div>Loading...</div>}
      {game && !getPending && <>
        <h1 className="text-2xl font-bold mb-4">Game lobby</h1>
        <div className="bg-white rounded shadow p-6 w-full max-w-lg">
          <div><strong>Name:</strong> {game.name}</div>
          <div><strong>Rounds:</strong> {game.rounds}</div>
          <div><strong>Difficulty:</strong> {game.difficulty}</div>
        </div>
        <form action={action} className="flex flex-col gap-4 w-full max-w-md">
          <input type="hidden" name="creator" value={user?.player_name} />
          <input type="hidden" name="code" value={game?.code} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={startPending || !user}
          >
            {startPending ? "Starting..." : "Start"}
          </button>
          {update && <div className="text-red-600">{update.error}</div>}
        </form>
      </>}
    </div>
  );
}
