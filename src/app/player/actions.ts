"use server";

import { redirect } from "next/navigation";
import { createSession } from "@utilities/session";
import { parseFormData } from "./parseFormData";

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

  await createSession(playerName, avatar);

  const prev = `${playerData.prev ?? "/"}`;
  redirect(prev);
};
