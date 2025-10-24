"use server";

import { getClient } from "@utilities/supabase/server";
import type { WinnerDetails } from "@types";

export async function getWinner(currentGameId: number, playerName: string, playerCode: string): Promise<WinnerDetails | null> {
  const client = await getClient();

  const args = {
    current_game_id: currentGameId,
    current_player_name: playerName,
    current_player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_winner", args);
  if (error) { return null; }

  return {
    name: data.name,
    score: data.score
  };
};