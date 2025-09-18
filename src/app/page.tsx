"use client";

import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "./components/button/brushButton";
import JoinButton from "./components/button/joinButton";

export default function Home() {
  const user = getUserContext();

  return (
    <main className="flex flex-col justify-center items-center gap-8">
      {user && <h1 className="text-4xl sm:text-5xl font-bold text-center">Welcome, {user.player_name}!</h1>}
      <Link href="/create">
        <BrushButton className="w-50">Create</BrushButton>
      </Link>
      <Link href="/join">
        <JoinButton className="w-50">Join</JoinButton>
      </Link>
    </main>
  );
}
