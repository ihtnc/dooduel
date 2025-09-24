"use server";

import { getClient } from "@utilities/supabase/server";
import type { CurrentGameDetails } from "@types";

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
    createdBy: data.created_by,
  };

  return game;
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
