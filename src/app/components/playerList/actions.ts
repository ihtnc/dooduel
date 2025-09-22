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
      isPainter: player.is_painter,
      hasAnswered: player.has_answered,
      currentScore: 0
    });
  }

  return players;
};

