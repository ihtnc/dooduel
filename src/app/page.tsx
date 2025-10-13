"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import JoinButton from "@/components/button/joinButton";
import ResumeButton from "./components/button/resumeButton";
import { getRecentGame } from "./actions";
import LeaveGame from "./components/leaveGame";
import type { GameDetails } from "@types";

export default function Home() {
  const user = getUserContext();
  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<GameDetails | null>(null);

  useEffect(() => {
    async function fetchGame() {
      const game = await getRecentGame(user?.playerName || '', user?.code || '');
      if (game !== null) {
        setGame(game);
      }

      setPending(false);
    }

    fetchGame();
  }, [user]);

  return (
    <main className="flex flex-col justify-center items-center gap-8">
      {user && <h1 className="text-4xl sm:text-5xl font-bold text-center">Welcome, {user.playerName}!</h1>}
      {pending && <div>Loading...</div>}
      {!pending && <>
        {game && <Link href={`/game/${game.name}`}>
          <ResumeButton className="w-50">Resume</ResumeButton>
        </Link>}
        {game && <LeaveGame game={game} />}
        {!game && <Link href="/create">
          <BrushButton className="w-50">Create</BrushButton>
        </Link>}
        {!game && <Link href="/join">
          <JoinButton className="w-50">Join</JoinButton>
        </Link>}
      </>}
    </main>
  );
}
