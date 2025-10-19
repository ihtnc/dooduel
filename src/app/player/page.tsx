"use client";

import {  useActionState, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import TextBox from "@/components/textBox";
import TextOverlay from "@/components/textOverlay";
import ProfileCheckButton from "@/components/button/profileCheckButton";
import ArrowLeftButton from "@/components/button/arrowLeftButton";
import AvatarEditor from "@/components/avatar/editor";
import NameIcon from "@/components/icons/nameIcon";
import { save } from "./actions";
import { cn } from "@utilities/index";

export default function PlayerPage() {
  const router = useRouter();
  const user = getUserContext();
  const [name, setName] = useState(user?.playerName || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [state, action, pending] = useActionState(save, {});
  const searchParams = useSearchParams();
  const prev = searchParams.get('prev') || "/";

  const navigateBack = () => {
    router.replace(prev);
  };

  const handleTextHidden = () => {
    if (state) { state.error = ""; }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="mb-6 font-subheading">Your details</h1>
      <AvatarEditor code={avatar} onChange={setAvatar} />
      <form action={action} className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2">
          <NameIcon alt="Player name" />
          <TextBox
            name="player_name"
            type="text"
            placeholder="Player name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <input name="avatar" type="hidden" value={avatar} />
        <input type="hidden" name="avatar" value={avatar} />
        <input type="hidden" name="current_player_name" value={user?.playerName} />
        <input type="hidden" name="current_player_code" value={user?.code} />
         <input type="hidden" name="prev" value={prev} />
        <TextOverlay
          className="min-w-50 w-fit h-[50px]"
          text={state?.error}
          textClassName={cn("font-error", "truncate")}
          showText={state?.error ? true : false}
          onTextHidden={handleTextHidden}
        >
          <ProfileCheckButton className="w-50" disabled={pending} type="submit" imageAlt="Save profile">
            {pending ? "Saving..." : "Save"}
          </ProfileCheckButton>
        </TextOverlay>
        {searchParams.has("prev") &&
          <ArrowLeftButton className="w-50" onClick={navigateBack} imageAlt="Go back">
            Back
          </ArrowLeftButton>
        }
      </form>
    </div>
  );
}
