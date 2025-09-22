"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import JoinButton from "@/components/button/joinButton";
import ResumeButton from "./components/button/resumeButton";
import { getRecentGameName } from "./actions";

export default function Home() {
  const user = getUserContext();
  const [pending, setPending] = useState(true);
  const [gameName, setGameName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGameName() {
      const gameName = await getRecentGameName(user?.player_name || '', user?.code || '');
      if (gameName !== null) {
        setGameName(gameName);
      }

      setPending(false);
    }

    fetchGameName();
  }, [user]);

  return (
    <main className="flex flex-col justify-center items-center gap-8">
      {user && <h1 className="text-4xl sm:text-5xl font-bold text-center">Welcome, {user.player_name}!</h1>}
      {pending && <div>Loading...</div>}
      {!pending && <>
        {gameName && <Link href={`/game/${gameName}`}>
          <ResumeButton className="w-50">Resume</ResumeButton>
        </Link>}
        <Link href="/create">
          <BrushButton className="w-50">Create</BrushButton>
        </Link>
        <Link href="/join">
          <JoinButton className="w-50">Join</JoinButton>
        </Link>
      </>}
    </main>
  );
}
