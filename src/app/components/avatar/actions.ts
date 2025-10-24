"use server";

import { getClient } from "@utilities/supabase/server";

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