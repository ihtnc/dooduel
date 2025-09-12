"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import { joinGame } from "./actions";

export default function JoinPage() {
  const [state, action, pending] = useActionState(joinGame, undefined);
  const user = getUserContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Join a game</h1>
      <form action={action} className="flex flex-col gap-4 w-full max-w-md">
        <input type="hidden" name="player_name" value={user?.player_name} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <input type="text" name="name" placeholder="Game name" className="border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" className="border p-2 rounded" />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={pending || !user}
        >
          {pending ? "Joining..." : "Join"}
        </button>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
