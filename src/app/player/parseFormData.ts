type PlayerForm = {
  player_name: FormDataEntryValue | null,
  avatar: FormDataEntryValue | null,
  current_player_name: FormDataEntryValue | null,
  current_player_code: FormDataEntryValue | null,
  prev: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): PlayerForm {
  const data: PlayerForm = {
    player_name: formData.get("player_name"),
    avatar: formData.get("avatar"),
    current_player_name: formData.get("current_player_name"),
    current_player_code: formData.get("current_player_code"),
    prev: formData.get("prev"),
  };

  return data;
};
