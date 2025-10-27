"use server";

import { getClient } from "@utilities/supabase/server";
import { convertToLayers } from "./utilities";
import type { Layer } from "@/components/doodle/types";
import type { CanvasSegmentRecord } from "@types";

export async function getGameCanvas(roundId: number, playerName: string, playerCode: string): Promise<Array<Layer> | null> {
  const client = await getClient();
  const args = {
    round_id: roundId,
    player_name: playerName,
    player_code: playerCode
  };
  const { data, error } = await client.rpc("get_game_canvas", args);

  if (error) { return null; }

  const layers = convertToLayers(data as unknown as CanvasSegmentRecord[] || []);
  return layers;
};