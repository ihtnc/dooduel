"use server";

import { getClient } from "@utilities/supabase/server";
import type { CurrentGameDetails, GameDetails } from "@types";

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
    playerCount: data.player_count
  };

  return game;
};

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
    playerCount: data.player_count
  };

  return game;
};