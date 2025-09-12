export type FormState = {
  [key: string]: string,
} | undefined;

export interface InitialGameDetails extends GameDetails {
  code: string,
};

export type GameDetails = {
  name: string,
  rounds: number,
  difficulty: number
};

export type User = {
  player_name: string,
  avatar: string,
  code: string,
};