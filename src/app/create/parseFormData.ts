type CreateForm = {
  rounds: FormDataEntryValue | null,
  difficulty: FormDataEntryValue | null,
  creator: FormDataEntryValue | null,
  password: FormDataEntryValue | null,
  avatar: FormDataEntryValue | null,
  code: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): CreateForm {
  const data: CreateForm = {
    rounds: formData.get("rounds"),
    difficulty: formData.get("difficulty"),
    creator: formData.get("creator"),
    password: formData.get("password"),
    avatar: formData.get("avatar"),
    code: formData.get("code"),
  }

  return data;
};
