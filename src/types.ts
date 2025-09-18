export type FormState = {
  [key: string]: string,
} | undefined;

export interface CreatedGameDetails extends GameDetails {
  code: string
};

export type GameDetails = {
  id: number,
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

export type PlayerDetails = {
  id: number,
  name: string,
  avatar: string,
  active: boolean,
  is_painter: boolean,
  has_answered: boolean,
  current_score: number
};

export interface NewPlayerPayload extends PlayerPayload {
  name: string,
  avatar: string,
};

export interface PlayerUpdatePayload extends PlayerPayload {
  active: boolean,
  avatar: string,
  current_score: number,
};

export type PlayerPayload = {
  id: number
};