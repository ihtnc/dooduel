type StartForm = {
  code: FormDataEntryValue | null,
  creator: FormDataEntryValue | null,
}

export function parseFormData(formData: FormData): StartForm {
  const data: StartForm = {
    code: formData.get("code"),
    creator: formData.get("creator"),
  };

  return data;
};
