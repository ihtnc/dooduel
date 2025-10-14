"use server";

import { redirect } from "next/navigation";
import { getClient } from "@utilities/supabase/server";
import { parseFormData } from "./parseFormData";
import { type CreatedGameDetails, type FormState } from "@types";

export async function getCreatedGame(name: string, creator: string): Promise<CreatedGameDetails | null> {
  const client = await getClient();

  const args = {
    game_name: name,
    creator
  };
  const { data, error } = await client.rpc("get_created_game", args);
  if (error) { return null; }

  const game: CreatedGameDetails = {
    id: data.id,
    code: data.code,
    name: data.name,
    status: data.status,
    rounds: data.rounds,
    difficulty: data.difficulty,
    hasPassword: data.has_password
  };
  return game;
};

export async function startGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const startData = parseFormData(formData);

  const code = startData.code;
  if (!code) { errors.code = "code is required"; }

  const creator = startData.creator;
  if (!creator) { errors.creator = "creator is required"; }

  if (Object.keys(errors).length > 0) { return; }

  const client = await getClient();

  const args = {
    game_code: code,
    creator
  };
  const { data, error } = await client.rpc("start_game", args);

  if (error) {
    errors.error = error?.message || "Unknown error";
    return errors;
  }

  const name = data.name;
  redirect(`/game/${name}`);
};

export async function updateAvatar(currentGameId: number, playerName: string, playerCode: string, avatar: string) {
  const client = await getClient();
  const args = {
    current_game_id: currentGameId,
    player_name: playerName,
    player_code: playerCode,
    new_avatar: avatar
  };
  const { data, error } = await client.rpc("update_player_avatar", args);

  if (!data || error) {
    return false;
  }

  return true;
};