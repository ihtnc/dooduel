"use server";

import { getClient } from "@utilities/supabase/server";

export async function getRecentGameName(playerName: string, playerCode: string): Promise<string | null> {
  const client = await getClient();

  const args = {
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_recent_game_name", args);
  if (error || (data ?? '') === '') { return null; }

  return data;
};