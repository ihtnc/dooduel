"use server";

import { getClient } from "@utilities/supabase/server";
import type { Brush, Layer, Segment } from "@/components/doodle/types";

export async function getGameCanvas(roundId: number, playerName: string, playerCode: string): Promise<Array<Layer> | null> {
  const client = await getClient();
  const args = {
    round_id: roundId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_canvas", args);

  if (error) { return null; }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sorted = (data as unknown as any[])?.sort((a, b) => (a.id - b.id)) ?? [];

  let currentBrush: Brush | null = null;
  let currentLayer: Layer | null = null;
  const layers: Array<Layer> = [];
  for (const item of sorted) {
    if (currentBrush === null || currentBrush.color !== item.brush_color || currentBrush.size !== item.brush_size) {
      currentBrush = { size: item.brush_size, color: item.brush_color };
      currentLayer = { segments: [], brush: currentBrush };
      layers.push(currentLayer);
    }

    const segment: Segment = { from: { x: item.from_x, y: item.from_y }, to: { x: item.to_x, y: item.to_y } };
    if (currentLayer !== null) {
      currentLayer.segments.push(segment);
    }
  }

  return layers;
};