"use server";

import { createClient } from "@utilities/supabase";
import { type CurrentGameDetails } from "@types";

export async function getCurrentGame(name: string, player_name: string, player_code: string): Promise<CurrentGameDetails | null> {
  const client = await createClient();

  const args = {
    game_name: name,
    player_name,
    player_code
  };
  const { data, error } = await client.rpc("get_current_game", args);
  if (error) { return null; }

  const game: CurrentGameDetails = {
    name: data.name,
    rounds: data.rounds,
    difficulty: data.difficulty,
    hasPassword: data.has_password,
    status: data.status,
    currentRound: data.current_round,
    currentPainterName: data.current_player_name
  };

  return game;
}
