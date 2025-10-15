"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import JoinButton from "@/components/button/joinButton";
import ResumeButton from "@/components/button/resumeButton";
import LeaveGame from "@/components/leaveGame";
import Loading from "@/components/loading";
import { getRecentGame } from "./actions";
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
      {pending &&
        <div className="flex h-full">
          <Loading className="-mt-16 self-center size-20" />
        </div>
      }
      {!pending && <>
        {user && <h1 className="font-bold text-center font-heading">Welcome, {user.playerName}!</h1>}
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
