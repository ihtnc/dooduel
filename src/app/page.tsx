"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import JoinButton from "@/components/button/joinButton";
import ResumeButton from "@/components/button/resumeButton";
import LeaveGame from "@/components/leaveGame";
import Loading from "@/components/loading";
import { getRecentGame } from "./actions";
import type { GameDetails } from "@types";
import InstructionsButton from "./components/button/instructionsButton";

export default function Home() {
  const router = useRouter();
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
          <Loading className="-mt-16 self-center scale-150" />
        </div>
      }
      {!pending && <>
        {user && <h1 className="text-center font-heading">Welcome, {user.playerName}!</h1>}
        {game && <ResumeButton className="w-50" onClick={() => router.push(`/game/${game?.name}`)}>Resume</ResumeButton>}
        {game && <LeaveGame game={game} />}
        {!game && <BrushButton className="w-50" onClick={() => router.push("/create")}>Create</BrushButton>}
        {!game && <JoinButton className="w-50" onClick={() => router.push("/join")}>Join</JoinButton>}
        <InstructionsButton className="w-50" onClick={() => router.push('/how-to-play')}>How to Play</InstructionsButton>
      </>}
    </main>
  );
}
