"use server";

import { createClient } from "@utilities/supabase";
import { type GameDetails } from "@types";

export async function getCurrentGame(name: string, player_name: string, player_code: string): Promise<GameDetails | null> {
  const client = await createClient();

  const args = {
    game_name: name,
    player_name,
    player_code
  };
  const { data, error } = await client.rpc("get_current_game", args);
  if (error) { return null; }

  const game: GameDetails = {
    name: data.name,
    rounds: data.rounds,
    difficulty: data.difficulty
  };

  return game;
}
