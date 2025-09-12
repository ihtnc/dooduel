"use server";

import { redirect } from "next/navigation";
import { createClient } from "@utilities/supabase";
import type { FormState } from "@types";
import { parseFormData } from "./parseFormData";

const game_rounds_default = 3;
const game_rounds_min = 1;
const game_rounds_max = 5;
const game_difficulty_default = 2;
const game_difficulty_min = 1;
const game_difficulty_max = 3;

export async function createGame(prevState: FormState, formData: FormData) {
  const errors: FormState = {};
  const createData = parseFormData(formData);

  const rounds = Number(createData.rounds);
  const isRoundsLowerThanMin = rounds !== 0 && rounds < game_rounds_min;
  const isRoundsGreaterThanMax = rounds !== 0 && rounds > game_rounds_max;
  if (Number.isNaN(rounds) || isRoundsLowerThanMin || isRoundsGreaterThanMax) {
    errors.rounds = "rounds is invalid";
  }

  const difficulty = Number(createData.difficulty);
  const isDifficultyLowerThanMin = difficulty !== 0 && difficulty < game_difficulty_min;
  const isDifficultyGreaterThanMax = difficulty !== 0 && difficulty > game_difficulty_max;
  if (Number.isNaN(difficulty) || isDifficultyLowerThanMin || isDifficultyGreaterThanMax) {
    errors.difficulty = "difficulty is invalid";
  }

  const creator = createData.creator;
  if (!creator) { errors.creator = "creator is required"; }

  if (Object.keys(errors).length > 0) { return errors; }

  const client = await createClient();

  const password = createData.password;
  const game = {
    password,
    rounds: rounds || game_rounds_default,
    difficulty: difficulty || game_difficulty_default,
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
