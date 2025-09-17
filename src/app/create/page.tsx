"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import GameButton from "@/components/button/gameButton";
import { createGame } from "./actions";

export default function CreatePage() {
  const [state, action, pending] = useActionState(createGame, undefined);
  const user = getUserContext();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Create a new game</h1>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="creator" value={user?.player_name} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <input type="password" name="password" placeholder="Password" className="border p-2 rounded" maxLength={20} />
        <input type="number" name="rounds" placeholder="Rounds (default: 3)" className="border p-2 rounded" min="1" max="5" />
        <input type="number" name="difficulty" placeholder="Difficulty (default: 2)" className="border p-2 rounded" min="1" max="3" />
        <GameButton className="w-50" disabled={pending || !user} type="submit" imageAlt="Create Game Icon">
          {pending ? "Creating..." : "Create"}
        </GameButton>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
