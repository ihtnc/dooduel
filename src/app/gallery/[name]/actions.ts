"use server";

import { getClient } from "@utilities/supabase/server";
import type { GameCanvasShowcaseDetails } from "@types";

export async function getGameCanvasShowcase(currentGameId: number, playerName: string, playerCode: string): Promise<Array<GameCanvasShowcaseDetails>> {
  const client = await getClient();

  const args = {
    current_game_id: currentGameId,
    current_player_name: playerName,
    current_player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_canvas_showcase", args);
  if (error) { return []; }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = data.map((item: any) => {
    const mappedItem: GameCanvasShowcaseDetails = {
      category: item.category,
      roundId: item.round_id,
      word: item.word,
      painterName: item.painter_name,
      painterAvatar: item.painter_avatar,
      painterScore: item.painter_score,
      starCount: item.star_count,
      loveCount: item.love_count,
      likeCount: item.like_count,
      happyCount: item.happy_count,
      amusedCount: item.amused_count,
      surprisedCount: item.surprised_count,
      confusedCount: item.confused_count,
      disappointedCount: item.disappointed_count,
      data: item.data
    };

    return mappedItem;
  });

  return result;
};