"use server";

import { getClient } from "@utilities/supabase/server";
import type { GameCanvasShowcaseDetails, GameCanvasShowcaseRecord } from "./types";
import { convertToLayers } from "@/components/doodle/utilities";

export async function getGameCanvasShowcase(currentGameId: number, playerName: string, playerCode: string): Promise<Array<GameCanvasShowcaseDetails>> {
  const client = await getClient();

  const args = {
    current_game_id: currentGameId,
    current_player_name: playerName,
    current_player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_canvas_showcase", args);
  if (error) { return []; }

  const canvasData = data as unknown as Array<GameCanvasShowcaseRecord>;
  const result = canvasData.map((item: GameCanvasShowcaseRecord) => {
    const mappedItem: GameCanvasShowcaseDetails = {
      category: item.category,
      roundId: item.round_id,
      word: item.word,
      painterName: item.painter_name,
      painterAvatar: item.painter_avatar,
      painterScore: item.painter_score || 0,
      starCount: item.star_count || 0,
      loveCount: item.love_count || 0,
      likeCount: item.like_count || 0,
      happyCount: item.happy_count || 0,
      amusedCount: item.amused_count || 0,
      surprisedCount: item.surprised_count || 0,
      confusedCount: item.confused_count || 0,
      disappointedCount: item.disappointed_count || 0,
      data: item.data || {},
      canvasData: convertToLayers(item.canvas_data || []),
    };

    return mappedItem;
  });

  return result;
};