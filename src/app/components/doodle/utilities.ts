import { Brush, Segment } from "./types";

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