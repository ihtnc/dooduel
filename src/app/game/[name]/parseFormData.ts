type LeaveGameForm = {
  game_name: FormDataEntryValue | null,
  player_name: FormDataEntryValue | null,
  player_code: FormDataEntryValue | null,
}

export function parseLeaveFormData(formData: FormData): LeaveGameForm {
  const data: LeaveGameForm = {
    game_name: formData.get("game_name"),
    player_name: formData.get("player_name"),
    player_code: formData.get("player_code"),
  }

  return data;
};

type SubmitAnswerForm = {
  game_name: FormDataEntryValue | null,
  player_name: FormDataEntryValue | null,
  player_code: FormDataEntryValue | null,
  answer: FormDataEntryValue | null,
}

export function parseSubmitAnswerFormData(formData: FormData): SubmitAnswerForm {
  const data: SubmitAnswerForm = {
    game_name: formData.get("game_name"),
    player_name: formData.get("player_name"),
    player_code: formData.get("player_code"),
    answer: formData.get("answer"),
  }

  return data;
};
