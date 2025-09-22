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

  const player_name = playerData.player_name as string;
  if (!player_name) {
    errors.player_name = "name is required.";
  }

  const avatar = playerData.avatar as string;
  if (!avatar) {
    errors.avatar = "avatar is required.";
  }

  if (Object.keys(errors).length > 0) { return errors; }

  await createSession(player_name, avatar);

  const prev = `${playerData.prev ?? "/"}`;
  redirect(prev);
};
