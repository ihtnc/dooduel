"use client";

import { useActionState, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import Slider from "@/components/slider";
import TextBox from "@/components/textBox";
import TextOverlay from "@/components/textOverlay";
import BrushButton from "@/components/button/brushButton";
import LockIcon from "@/components/icons/lockIcon";
import EaselIcon from "@/components/icons/easelIcon";
import KidIcon from "@/components/icons/kidIcon";
import ArtistIcon from "@/components/icons/artistIcon";
import { createGame } from "./actions";
import { GAME_ROUNDS_DEFAULT, GAME_ROUNDS_MAX, GAME_ROUNDS_MIN, GAME_DIFFICULTY_DEFAULT, GAME_DIFFICULTY_MAX, GAME_DIFFICULTY_MIN } from "./constants";
import { cn } from "@utilities/index";

export default function CreatePage() {
  const user = getUserContext();
  const [rounds, setRounds] = useState(GAME_ROUNDS_DEFAULT);
  const [state, action, pending] = useActionState(createGame, undefined);

  const handleTextHidden = () => {
    if (state) { state.error = ""; }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="mb-6 font-subheading">Create a new game</h2>
      <form action={action} className="flex flex-col gap-4 items-center">
        <input type="hidden" name="creator" value={user?.playerName} />
        <input type="hidden" name="avatar" value={user?.avatar} />
        <input type="hidden" name="code" value={user?.code} />
        <div className="flex items-center gap-2 w-full">
          <LockIcon alt="Game password" className="-mr-2" />
          <TextBox name="password" placeholder="Password" maxLength={20} />
        </div>
        <div className="flex items-center gap-2 w-full">
          <EaselIcon alt="Number of rounds" className="-mr-1 -ml-1" />
          <div className="flex flex-col items-center w-full">
            <span className="flex text-sm -mt-2 mb-1">Rounds</span>
            <Slider
              name="rounds"
              min={GAME_ROUNDS_MIN}
              max={GAME_ROUNDS_MAX}
              defaultValue={GAME_ROUNDS_DEFAULT}
              onInput={(e) => {
                setRounds(parseInt((e.target as HTMLInputElement).value));
              }}
              className="flex"
            />
          </div>
          <span className="font-bold text-lg w-[50px] flex place-content-center mt-2">{rounds}</span>
        </div>
        <div className="flex items-center gap-2 w-full">
          <KidIcon alt="Difficulty level" className="scale-80 ml-1 -mr-3" />
          <div className="flex flex-col items-center w-full">
            <span className="flex text-sm -mt-2 mb-1">Difficulty</span>
            <Slider
              name="difficulty"
              min={GAME_DIFFICULTY_MIN}
              max={GAME_DIFFICULTY_MAX}
              defaultValue={GAME_DIFFICULTY_DEFAULT}
            />
          </div>
          <ArtistIcon alt="Difficulty level" className="scale-80 -ml-2 -mr-2" />
        </div>
        <TextOverlay
          className="min-w-50 w-fit h-[50px]"
          text={state?.error}
          textClassName={cn("font-error", "truncate"
          )}
          showText={state?.error ? true : false}
          onTextHidden={handleTextHidden}
        >
          <BrushButton className="w-50" disabled={pending || !user} type="submit" imageAlt="Create game">
            {pending ? "Creating..." : "Create"}
          </BrushButton>
        </TextOverlay>
      </form>
    </div>
  );
}
