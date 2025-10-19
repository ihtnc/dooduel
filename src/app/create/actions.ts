"use server";

import { redirect } from "next/navigation";
import { getClient } from "@utilities/supabase/server";
import type { FormState } from "@types";
import { parseFormData } from "./parseFormData";
import { GAME_ROUNDS_MAX, GAME_ROUNDS_MIN, GAME_ROUNDS_DEFAULT, GAME_DIFFICULTY_MAX, GAME_DIFFICULTY_MIN, GAME_DIFFICULTY_DEFAULT } from "./constants";

export async function createGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const createData = parseFormData(formData);

  const rounds = Number(createData.rounds);
  const isRoundsLowerThanMin = rounds !== 0 && rounds < GAME_ROUNDS_MIN;
  const isRoundsGreaterThanMax = rounds !== 0 && rounds > GAME_ROUNDS_MAX;
  if (Number.isNaN(rounds) || isRoundsLowerThanMin || isRoundsGreaterThanMax) {
    errors.rounds = "rounds is invalid";
  }

  const difficulty = Number(createData.difficulty);
  const isDifficultyLowerThanMin = difficulty !== 0 && difficulty < GAME_DIFFICULTY_MIN;
  const isDifficultyGreaterThanMax = difficulty !== 0 && difficulty > GAME_DIFFICULTY_MAX;
  if (Number.isNaN(difficulty) || isDifficultyLowerThanMin || isDifficultyGreaterThanMax) {
    errors.difficulty = "difficulty is invalid";
  }

  const creator = createData.creator;
  if (!creator) { errors.creator = "creator is required"; }

  if (Object.keys(errors).length > 0) {
    throw new Error("Invalid details", { cause: errors });
  }

  const client = await getClient();

  const password = createData.password;
  const game = {
    password,
    rounds: rounds || GAME_ROUNDS_DEFAULT,
    difficulty: difficulty || GAME_DIFFICULTY_DEFAULT,
    creator_name: creator,
    creator_avatar: createData.avatar,
    creator_code: createData.code,
  };
  const { data, error } = await client.rpc("create_game", game);

  if (!data || error) {
    errors.error = error?.message || "Unknown error";
    return errors;
  }

  const name = data.name;
  redirect(`/lobby/${name}`);
}
