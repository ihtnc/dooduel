"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import FlagButton from "@/components/button/flagButton";
import { cn } from "@utilities/index";
import { leaveGame } from "./actions";
import type { CurrentGameDetails } from "@types";

export default function LeaveGame({ game, className }: { game: CurrentGameDetails, className?: string }) {
  const user = getUserContext();

  const [state, action, pending] = useActionState(leaveGame, undefined);

  return <>
    <form action={action} className={cn("flex", className?.split(" ") ?? [])}>
      <input type="hidden" name="game_name" value={game.name} />
      <input type="hidden" name="player_name" value={user?.playerName} />
      <input type="hidden" name="player_code" value={user?.code} />
      <FlagButton imageAlt="Leave game" className="w-50" disabled={pending || !user} type="submit">
        {pending ? "Leaving..." : "Leave"}
      </FlagButton>
      {state && <div className="text-red-600">{state.error}</div>}
    </form>
  </>;
};