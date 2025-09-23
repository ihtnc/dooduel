"use server";

import { redirect } from "next/navigation";
import { getClient } from "@utilities/supabase/server";
import type { FormState, CurrentGameDetails } from "@types";
import { parseLeaveFormData, parseSubmitAnswerFormData } from "./parseFormData";

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

export async function leaveGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const leaveData = parseLeaveFormData(formData);

  const client = await getClient();
  const args = {
    game_name: leaveData.game_name,
    player_name: leaveData.player_name,
    player_code: leaveData.player_code
  };

  const { data, error } = await client.rpc("leave_game", args);

  if (!data || error) {
    errors.error = error?.message || "Unknown error";
    return errors;
  }

  redirect(`/`);
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

export async function getWordToPaint(currentGameId: number, playerName: string, playerCode: string): Promise<string | null> {
  const client = await getClient();
  const args = {
    current_game_id: currentGameId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_word_to_paint", args);

  if (error || (data ?? '') === '') {
    return null;
  }

  return data;
};

export async function submitAnswer(prevState: FormState, formData: FormData) {
  const state: FormState = {};
  const submitAnswerData = parseSubmitAnswerFormData(formData);

  const client = await getClient();
  const args = {
    game_name: submitAnswerData.game_name,
    player_name: submitAnswerData.player_name,
    player_code: submitAnswerData.player_code,
    answer: submitAnswerData.answer
  };

  const { data, error } = await client.rpc("submit_answer", args);

  if (isNaN(data) || error) {
    state.error = error?.message || "Unknown error";
    return state;
  }

  state.result = `${Number(data)}`;
  return state;
};