export type FormState = {
  [key: string]: string,
} | undefined;

export interface CreatedGameDetails extends GameDetails {
  code: string
};

export type GameDetails = {
  id: number,
  name: string,
  status: GameStatus,
  rounds: number,
  difficulty: number,
  hasPassword: boolean,
  playerCount: number,
};

export interface CurrentGameDetails extends GameDetails {
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

export type WinnerDetails = {
  name: string,
  score: number
};

export interface NewPlayerPayload extends PlayerPayload {
  name: string,
  avatar: string,
};

export interface PlayerUpdatePayload extends PlayerPayload {
  name: string,
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

export const GameStatus = {
  Initial: 'initial',
  Ready: 'ready',
  InProgress: 'inprogress',
  TurnEnd: 'turnend',
  RoundEnd: 'roundend',
  Completed: 'completed'
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

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
  round_id: number,
  current_round: number,
  word: string
};

export interface TurnEndDataPayload extends BaseRoundDataPayload {
  round_id: number,
  current_round: number,
  word: string,
  painters_left: number
};

export interface RoundEndDataPayload extends BaseRoundDataPayload {
  round_id: number,
  current_round: number,
  word: string,
  player_count: number
};

export interface GameCompletedDataPayload extends BaseRoundDataPayload {
  total_score: number
  word: string,
};

export type CanvasUpdatePayload = CanvasSegmentRecord;

export type CanvasSegmentRecord = {
  id: number,
  brush_size: number,
  brush_color: string,
  from_x: number,
  from_y: number,
  to_x: number,
  to_y: number
};

export const GameReaction = {
  Star: 'star',
  Love: 'love',
  Like: 'like',
  Happy: 'happy',
  Amused: 'amused',
  Surprised: 'surprised',
  Confused: 'confused',
  Disappointed: 'disappointed'
} as const;

export type GameReaction = typeof GameReaction[keyof typeof GameReaction];