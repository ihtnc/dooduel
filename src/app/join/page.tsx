"use client";

import { useActionState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import TextBox from "@/components/textBox";
import TextOverlay from "@/components/textOverlay";
import JoinButton from "@/components/button/joinButton";
import NameIcon from "@/components/icons/nameIcon";
import LockIcon from "@/components/icons/lockIcon";
import { joinGame } from "./actions";
import { cn } from "@utilities/index";

export default function JoinPage() {
  const [state, action, pending] = useActionState(joinGame, undefined);
  const user = getUserContext();

  const handleTextHidden = () => {
    if (state) { state.error = ""; }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-6 font-subheading">Join a game</h2>
      <form action={action} className="flex flex-col gap-4 items-center">
        <input type="hidden" name="player_name" value={user?.playerName} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <div className="flex items-center gap-2 w-full">
          <NameIcon alt="Game name" />
          <TextBox autoFocus type="text" name="name" placeholder="Game name" />
        </div>
        <div className="flex items-center gap-2 w-full">
          <LockIcon alt="Game password" />
          <TextBox type="password" name="password" placeholder="Password" />
        </div>
        <TextOverlay
          className="min-w-50 w-fit h-[50px]"
          text={state?.error}
          textClassName={cn("font-error", "truncate")}
          showText={state?.error ? true : false}
          onTextHidden={handleTextHidden}
        >
          <JoinButton className="w-50" disabled={pending || !user} type="submit" imageAlt="Join game">
            {pending ? "Joining..." : "Join"}
          </JoinButton>
        </TextOverlay>
      </form>
    </div>
  );
}
