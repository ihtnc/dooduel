"use server";

import { redirect } from "next/navigation";
import { createSession } from "@utilities/session";
import { getClient } from "@utilities/supabase/server";
import { parseFormData } from "./parseFormData";
import { type GameDetails } from "@types";

type FormState = {
  [key: string]: string,
};

export async function save(
  state: FormState,
  formData: FormData,
) {
  const errors: FormState = {};
  const playerData = parseFormData(formData);

  const playerName = playerData.player_name as string;
  if (!playerName) {
    errors.error = "name is required.";
  }

  const avatar = playerData.avatar as string;
  if (!avatar) {
    errors.error = "avatar is required.";
  }

  if (Object.keys(errors).length > 0) { return errors; }

  const currentPlayerName = playerData.current_player_name as string;
  const currentPlayerCode = playerData.current_player_code as string;

  let recentGame: GameDetails | null = null;
  if (currentPlayerName.length > 0 && currentPlayerCode.length > 0) {
    recentGame = await getRecentGame(currentPlayerName, currentPlayerCode);
  }

  if (recentGame && currentPlayerName.toLocaleLowerCase() !== playerName.toLocaleLowerCase()) {
    const isAvailable = await isNameAvailable(recentGame.id, playerName);
    if (!isAvailable) {
      errors.error = "name exists in your game.";
      return errors;
    }
  }

  const code = await createSession(playerName, avatar);

  if (recentGame) {
    const updated = await updatePlayer(recentGame.id, currentPlayerName, currentPlayerCode, playerName, avatar, code);
    if (!updated) {
      errors.error = "unable to update details.";
      return errors;
    }
  }

  const prev = `${playerData.prev ?? "/"}`;
  redirect(prev);
};

async function getRecentGame(playerName: string, playerCode: string): Promise<GameDetails | null> {
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

async function isNameAvailable(currentGameId: number, playerName: string): Promise<boolean> {
  const client = await getClient();

  const args = {
    current_game_id: currentGameId,
    player_name: playerName
  };

  const { data, error } = await client.rpc("is_name_available", args);
  if (error) { return false; }

  return data;
};

async function updatePlayer(currentGameId: number, currentPlayerName: string, currentCode: string, newPlayerName: string, newAvatar: string, newCode: string): Promise<boolean> {
  const client = await getClient();

  const args = {
    current_game_id: currentGameId,
    current_player_name: currentPlayerName,
    current_player_code: currentCode,
    new_player_name: newPlayerName,
    new_avatar: newAvatar,
    new_player_code: newCode
  };

  const { data, error } = await client.rpc("update_player", args);
  if (error) { return false; }
  return data;
};