type JoinForm = {
  player_name: FormDataEntryValue | null,
  avatar: FormDataEntryValue | null,
  code: FormDataEntryValue | null,
  name: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): JoinForm {
  const data: JoinForm = {
    player_name: formData.get("player_name"),
    avatar: formData.get("avatar"),
    code: formData.get("code"),
    name: formData.get("name"),
    password: formData.get("password"),
  }

  return data;
};
