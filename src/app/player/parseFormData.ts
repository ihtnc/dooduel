type PlayerForm = {
  player_name: FormDataEntryValue | null,
  avatar: FormDataEntryValue | null,
  prev: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): PlayerForm {
  const data: PlayerForm = {
    player_name: formData.get("player_name"),
    avatar: formData.get("avatar"),
    prev: formData.get("prev"),
  };

  return data;
};
