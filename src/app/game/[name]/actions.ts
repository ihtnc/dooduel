"use server";

import { redirect } from "next/navigation";
import { getClient } from "@utilities/supabase/server";
import type { FormState, CurrentGameDetails } from "@types";
import { parseFormData } from "./parseFormData";

export async function getCurrentGame(name: string, playerName: string, playerCode: string): Promise<CurrentGameDetails | null> {
  const client = await getClient();

  const args = {
    game_name: name,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_current_game", args);
  if (error) { return null; }

  const game: CurrentGameDetails = {
    id: data.id,
    name: data.name,
    rounds: data.rounds,
    difficulty: data.difficulty,
    hasPassword: data.has_password,
    status: data.status,
    currentRound: data.current_round,
    currentPainterName: data.current_player_name
  };

  return game;
};

export async function leaveGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const leaveData = parseFormData(formData);

  const client = await getClient();
  const args = {
    game_name: leaveData.game_name,
    player_name: leaveData.player_name,
    player_code: leaveData.player_code
  };

  const { data, error } = await client.rpc("leave_game", args);

  if (!data || error) {
    errors.error = error?.message || "Unknown error";
    return errors;
  }

  redirect(`/`);
};
