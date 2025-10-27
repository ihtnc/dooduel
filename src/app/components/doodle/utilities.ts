import type { CanvasSegmentRecord } from "@types";
import type { Brush, Layer, Segment } from "./types";

export const getActualBrushWidth = (brush: Brush): number => {
  return brush.size * 10;
};

export const renderSegment = (context: CanvasRenderingContext2D, brush: Brush, segment: Segment) => {
  const { from, to } = segment;
  const width = getActualBrushWidth(brush);

  context.strokeStyle = brush.color;
  context.lineCap = "round";

  if (from.x === to.x && from.y === to.y) {
    context.fillStyle = brush.color;
    context.beginPath();
    context.arc(from.x, from.y, width / 2, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  } else {
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  }
};

export const convertToLayers = (segments: Array<CanvasSegmentRecord>): Array<Layer> => {
  const list = [...segments];
  const sorted = list.sort((a, b) => (a.id - b.id));

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