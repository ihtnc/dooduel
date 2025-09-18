export type FormState = {
  [key: string]: string,
} | undefined;

export interface CreatedGameDetails extends GameDetails {
  code: string
};

export type GameDetails = {
  name: string,
  rounds: number,
  difficulty: number,
  hasPassword: boolean
};

export interface CurrentGameDetails extends GameDetails {
  status: string,
  currentRound: number | null,
  currentPainterName: string | null,
};

export type User = {
  player_name: string,
  avatar: string,
  code: string,
};