"use server";

import { getClient } from "@utilities/supabase/server";
import type { PlayerDetails } from "@types";

export async function getPlayers(gameId: number, playerName: string, playerCode: string): Promise<Array<PlayerDetails> | null> {
  const client = await getClient();

  const args = {
    current_game_id: gameId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_players", args);
  if (error) { return null; }

  const players: Array<PlayerDetails> = [];
  for (const player of data) {
    players.push({
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      active: player.active,
      is_painter: player.is_painter,
      has_answered: player.has_answered,
      current_score: 0
    });
  }

  return players;
};

