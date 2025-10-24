"use server";

import { redirect } from "next/navigation";
import { getClient } from "@utilities/supabase/server";
import { parseLeaveFormData, parseSubmitAnswerFormData } from "./parseFormData";
import type { FormState, RoundDataPayload } from "@types";
import type { CanvasData } from "./types";

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

export async function getGameRoundData(currentGameId: number, playerName: string, playerCode: string): Promise<RoundDataPayload | null> {
  const client = await getClient();
  const args = {
    current_game_id: currentGameId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_round_data", args);

  if (error || (data ?? '') === '') {
    return null;
  }

  return data as unknown as RoundDataPayload;
};

export async function submitAnswer(prevState: FormState, formData: FormData) {
  const state: FormState = {};
  const submitAnswerData = parseSubmitAnswerFormData(formData);

  const roundId = Number(submitAnswerData.round_id);
  if (Number.isNaN(roundId) || roundId <= 0) {
    state.error = "invalid round details";
  }

  if (Object.keys(state).length > 0) {
    throw new Error("invalid game state", { cause: state });
  }

  const answer = submitAnswerData.answer;
  if (!answer) { state.error = "Answer is required"; }

  if (Object.keys(state).length > 0) {
    return state;
  }

  const client = await getClient();
  const args = {
    round_id: submitAnswerData.round_id,
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

export async function drawCanvas(roundId: number, playerName: string, playerCode: string, data: Array<CanvasData>): Promise<boolean> {
  const client = await getClient();

  const args = {
    round_id: roundId,
    player_name: playerName,
    player_code: playerCode,
    brush_size: data.map(d => d.brush.size),
    brush_color: data.map(d => d.brush.color),
    from_x: data.map(d => d.segment.from.x),
    from_y: data.map(d => d.segment.from.y),
    to_x: data.map(d => d.segment.to.x),
    to_y: data.map(d => d.segment.to.y),
  };
  const { data: result, error } = await client.rpc("draw_canvas", args);

  if (error) { return false; }
  return result || false;
};