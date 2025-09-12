"use client";

import Link from "next/link";
import { getUserContext } from "@/components/userContextProvider";

export default function Home() {
  const user = getUserContext();

  return (
    <div className="font-sans grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col items-center gap-8">
        {user && <h1 className="text-4xl sm:text-5xl font-bold text-center">Welcome, {user.player_name}!</h1>}
        <Link href="/create">
          <button className="px-8 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition">Create</button>
        </Link>
        <Link href="/join">
          <button className="px-8 py-3 rounded-lg bg-gray-200 text-gray-900 text-lg font-semibold shadow hover:bg-gray-300 transition">Join</button>
        </Link>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Footer
      </footer>
    </div>
  );
}
