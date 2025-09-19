"use client";

import {  useActionState, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import ProfileCheckButton from "@/components/button/profileCheckButton";
import AvatarEditor from "@/components/avatar/editor";
import { save } from "./actions";
import NameIcon from "@/components/icons/nameIcon";

export default function PlayerPage() {
  const user = getUserContext();
  const [name, setName] = useState(user?.player_name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [state, action, pending] = useActionState(save, {});

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold mb-6">Your details</h1>
      <AvatarEditor code={avatar} onChange={setAvatar} />
      <form action={action} className="flex flex-col gap-4 items-center">
        <div className="flex items-center gap-2">
          <NameIcon alt="Player name" />
          <input
            name="player_name"
            type="text"
            placeholder="Player name"
            className="border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <input
          name="avatar"
          type="hidden"
          value={avatar}
        />
        <ProfileCheckButton className="w-50" disabled={pending} type="submit" imageAlt="Save profile">
          {pending ? "Saving..." : "Save"}
        </ProfileCheckButton>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
