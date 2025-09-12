"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import { getCurrentGame } from "./actions";
import type { GameDetails } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<GameDetails | null>(null);

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      {pending && <div>Loading...</div>}
      {game && !pending && <>
        <h1 className="text-2xl font-bold mb-4">Current game</h1>
        <div className="bg-white rounded shadow p-6 w-full max-w-lg">
          <div><strong>Name:</strong> {game.name}</div>
          <div><strong>Rounds:</strong> {game.rounds}</div>
          <div><strong>Difficulty:</strong> {game.difficulty}</div>
        </div>
      </>}
    </div>
  );
}
