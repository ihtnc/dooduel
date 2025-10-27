import { Layer } from "@/components/doodle/types"
import { CanvasSegmentRecord } from "@types";

export type GameCanvasShowcaseDetails = {
  category: string,
  roundId: number,
  word: string,
  painterName: string,
  painterAvatar: string,
  painterScore: number,
  starCount: number,
  loveCount: number,
  likeCount: number,
  happyCount: number,
  amusedCount: number,
  surprisedCount: number,
  confusedCount: number,
  disappointedCount: number,
  data: Record<string, string>
  canvasData: Array<Layer>
};

export type GameCanvasShowcaseRecord = {
  category: string,
  round_id: number,
  word: string,
  painter_name: string,
  painter_avatar: string,
  painter_score: number,
  star_count: number,
  love_count: number,
  like_count: number,
  happy_count: number,
  amused_count: number,
  surprised_count: number,
  confused_count: number,
  disappointed_count: number,
  data: Record<string, string>
  canvas_data: Array<CanvasSegmentRecord>
}