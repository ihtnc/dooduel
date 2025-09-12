"use server";

import { redirect } from "next/navigation";
import { createClient } from "@utilities/supabase";
import { type FormState } from "@types";
import { parseFormData } from "./parseFormData";

export async function joinGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const joinData = parseFormData(formData);

  const playerName = joinData.player_name;
  if (!playerName) { errors.player_name = "player_name is required"; }

  const password = joinData.password;
  const name = joinData.name;
  if (!name) { errors.name = "name is required"; }

  if (Object.keys(errors).length > 0) { return errors; }

  const player_name = joinData.player_name;
  const avatar = joinData.avatar;
  const code = joinData.code;

  const client = await createClient();

  const args = {
    game_name: name,
    game_password: password,
    player_name,
    player_avatar: avatar,
    player_code: code
  };
  const { data, error } = await client.rpc("join_game", args);
  if (error) {
    errors.error = error?.message || "Unknown error";
    return errors;
  }

  const game_name = data.name;
  redirect(`/game/${game_name}`);
}
