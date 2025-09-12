"use client";

import {  useActionState, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import { save } from "./actions";

export default function PlayerPage() {
  const user = getUserContext();
  const [name, setName] = useState(user?.player_name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [state, action, pending] = useActionState(save, {});

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Your details</h1>
      <form action={action} className="flex flex-col gap-4 w-full max-w-md">
        <input
          name="player_name"
          type="text"
          placeholder="Name"
          className="border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          name="avatar"
          type="text"
          placeholder="Avatar"
          className="border rounded px-3 py-2"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={pending}
        >
          {pending ? "Saving..." : "Save"}
        </button>
        {state && <div className="text-red-600">{state.error}</div>}
      </form>
    </div>
  );
}
