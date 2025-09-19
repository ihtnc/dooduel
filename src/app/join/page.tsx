"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import JoinButton from "@/components/button/joinButton";
import NameIcon from "@/components/icons/nameIcon";
import LockIcon from "@/components/icons/lockIcon";
import { joinGame } from "./actions";

export default function JoinPage() {
  const [state, action, pending] = useActionState(joinGame, undefined);
  const user = getUserContext();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Join a game</h1>
      <form action={action} className="flex flex-col gap-4 items-center">
        <input type="hidden" name="player_name" value={user?.player_name} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <div className="flex items-center gap-2 w-full">
          <NameIcon alt="Game name" />
          <input type="text" name="name" placeholder="Game name" className="border p-2 rounded" required />
        </div>
        <div className="flex items-center gap-2 w-full">
          <LockIcon alt="Game password" />
          <input type="password" name="password" placeholder="Password" className="border p-2 rounded" />
        </div>
        <JoinButton className="w-50" disabled={pending || !user} type="submit" imageAlt="Join game">
          {pending ? "Joining..." : "Join"}
        </JoinButton>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
