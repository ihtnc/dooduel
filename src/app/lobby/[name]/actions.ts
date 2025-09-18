"use server";

import { createClient } from "@utilities/supabase";
import { type CreatedGameDetails, type FormState } from "@types";
import { parseFormData } from "./parseFormData";
import { redirect } from "next/navigation";

export async function getCreatedGame(name: string, creator: string): Promise<CreatedGameDetails | null> {
  const client = await createClient();

  const args = {
    game_name: name,
    creator
  };
  const { data, error } = await client.rpc("get_created_game", args);
  if (error) { return null; }

  const game: CreatedGameDetails = {
    code: data.code,
    name: data.name,
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

  const client = await createClient();

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