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
  status: GameStatus,
  currentRound: number | null,
  createdBy: string,
};

export type User = {
  playerName: string,
  avatar: string,
  code: string,
};

export type PlayerDetails = {
  id: number,
  name: string,
  avatar: string,
  active: boolean,
  isPainter: boolean,
  hasAnswered: boolean,
  currentScore: number
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

export type RoundStartPayload = {
  painter_id: number
};

export type GamePayload = {
  id: number
};

export enum GameStatus {
  Initial = 'initial',
  Ready = 'ready',
  InProgress = 'inprogress',
  TurnEnd = 'turnend',
  RoundEnd = 'roundend',
  Completed = 'completed'
};

export type RoundDataPayload = InitialRoundDataPayload | ReadyRoundDataPayload | InProgressDataPayload | RoundEndDataPayload | GameCompletedDataPayload;

type BaseRoundDataPayload = {
  status: GameStatus
};

export interface InitialRoundDataPayload extends BaseRoundDataPayload {
  player_count: number
};

export interface ReadyRoundDataPayload extends BaseRoundDataPayload {
  player_count: number
};

export interface InProgressDataPayload extends BaseRoundDataPayload {
  current_round: number,
  word: string
};

export interface TurnEndDataPayload extends BaseRoundDataPayload {
  current_round: number,
  word: string,
  painters_left: number
};

export interface RoundEndDataPayload extends BaseRoundDataPayload {
  current_round: number,
  word: string,
  player_count: number
};

export interface GameCompletedDataPayload extends BaseRoundDataPayload {
  total_score: number
  word: string,
}