type LeaveForm = {
  game_name: FormDataEntryValue | null,
  player_name: FormDataEntryValue | null,
  player_code: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): LeaveForm {
  const data: LeaveForm = {
    game_name: formData.get("game_name"),
    player_name: formData.get("player_name"),
    player_code: formData.get("player_code"),
  }

  return data;
};
