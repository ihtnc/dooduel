"use server";

import { getClient } from "@utilities/supabase/server";
import type { GameDetails } from "@types";

export async function getRecentGame(playerName: string, playerCode: string): Promise<GameDetails | null> {
  const client = await getClient();

  const args = {
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_recent_game", args);
  if (error || (data ?? '') === '') { return null; }

  const game: GameDetails = {
    id: data.id,
    name: data.name,
    status: data.status,
    rounds: data.rounds,
    difficulty: data.difficulty,
    hasPassword: data.has_password,
  };

  return game;
};