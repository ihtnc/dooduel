import { use2dAnimatedCanvas, type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler } from "@ihtnc/use-animated-canvas";
import { renderSegment } from "./utilities";
import { cn } from "@utilities/index";
import type { Layer } from "./types";

export default function Doodle({
  canvas,
  className,
  originalCanvasSizePx = 662,
  backgroundColor = "#D3DAD9"
} : {
  canvas: Array<Layer>;
  className?: string;
  originalCanvasSizePx?: number;
  backgroundColor?: string;
}) {
  let forceRedraw = true;

  type DrawData = {
    layers: Array<Layer>,
    drawCanvas: boolean
  };

  const initialiseData: InitialiseDataHandler<DrawData> = () => {
    return { layers: canvas, drawCanvas: canvas.length > 0 };
  };

  const preRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    if (forceRedraw) {
      data.data!.layers = canvas;
      data.data!.drawCanvas = true;
      forceRedraw = false;
    }

    return data;
  };

  const render: AnimatedCanvasRenderFunction<DrawData> = (context, data) => {
    if (!data.data!.drawCanvas) { return; }

    const clientHeight = Math.min(data.drawData.clientHeight, data.drawData.clientWidth);
    const scale = clientHeight / originalCanvasSizePx;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(scale, scale);
    context.beginPath();
    context.clearRect(0, 0, originalCanvasSizePx, originalCanvasSizePx);

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, originalCanvasSizePx, originalCanvasSizePx);

    if (data.data!.layers.length === 0) { return; }

    context.save();
    for (const layer of data.data!.layers) {
      const { brush, segments } = layer;
      if (segments.length === 0) { continue; }

      for (const segment of segments) {
        renderSegment(context, brush, segment);
      }
    }

    context.restore();
  };

  const { Canvas } = use2dAnimatedCanvas<DrawData>({
    initialiseData,
    preRenderTransform,
    render,
    options: { clearEveryFrame: false, protectData: false }
  });

  const onCanvasResize = () => {
    forceRedraw = true;
  };

  return (<>
    <div className={cn(
      className?.split(" ")
      )}>
      <Canvas className="w-full h-full" onCanvasResize={onCanvasResize} />
    </div>
  </>);
}