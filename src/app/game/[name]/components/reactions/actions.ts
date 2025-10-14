"use server";

import { getClient } from "@utilities/supabase/server";

export async function addGameReaction(roundId: number, playerName: string, playerCode: string, reaction: string): Promise<boolean> {
  const client = await getClient();
  const args = {
    round_id: roundId,
    player_name: playerName,
    player_code: playerCode,
    reaction
  };
  const { data, error } = await client.rpc("add_game_reaction", args);

  if (error) { return false; }

  return data || false;
};

export async function getGameReaction(roundId: number, playerName: string, playerCode: string): Promise<string | null> {
  const client = await getClient();
  const args = {
    round_id: roundId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_reaction", args);

  if (error) { return null; }

  return data || null;
};
