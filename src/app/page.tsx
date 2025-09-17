"use client";

import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import BattleButton from "./components/button/battleButton";
import GameButton from "./components/button/gameButton";

export default function Home() {
  const user = getUserContext();

  return (
    <main className="flex flex-col items-center gap-8">
      {user && <h1 className="text-4xl sm:text-5xl font-bold text-center">Welcome, {user.player_name}!</h1>}
      <Link href="/create">
        <GameButton className="w-50">Create</GameButton>
      </Link>
      <Link href="/join">
        <BattleButton className="w-50">Join</BattleButton>
      </Link>
    </main>
  );
}
