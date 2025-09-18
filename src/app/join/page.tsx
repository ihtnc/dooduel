"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import JoinButton from "@/components/button/joinButton";
import { joinGame } from "./actions";

export default function JoinPage() {
  const [state, action, pending] = useActionState(joinGame, undefined);
  const user = getUserContext();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Join a game</h1>
      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="player_name" value={user?.player_name} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <input type="text" name="name" placeholder="Game name" className="border p-2 rounded" required />
        <input type="password" name="password" placeholder="Password" className="border p-2 rounded" />
        <JoinButton className="w-50" disabled={pending || !user} type="submit" imageAlt="Join Game Icon">
          {pending ? "Joining..." : "Join"}
        </JoinButton>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
