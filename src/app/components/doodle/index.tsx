import { useEffect, useState } from "react";
import { use2dAnimatedCanvas, type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler } from "@ihtnc/use-animated-canvas";
import { getUserContext } from "@/components/userContextProvider";
import Loading from "@/components/loading";
import { getGameCanvas } from "./actions";
import { renderSegment } from "./utilities";
import { cn } from "@utilities/index";
import type { Layer } from "./types";

export default function Doodle({
  roundId,
  className
} : {
  roundId: number;
  className?: string;
}) {
  const [pending, setPending] = useState(true);
  const [canvas, setCanvas] = useState<Array<Layer>>([]);
  const user = getUserContext();
  const originalCanvasSizePx = 662;
  let forceRedraw = true;

  type DrawData = {
    layers: Array<Layer>,
    drawCanvas: boolean
  };

  useEffect(() => {
    async function fetchCanvas() {
      if (roundId === undefined) {
        setPending(false);
        return;
      }

      const canvas = await getGameCanvas(roundId, user?.playerName || '', user?.code || '');
      if (canvas) { setCanvas(canvas); }
      setPending(false);
    }

    setCanvas([]);
    setPending(true);
    fetchCanvas();
  }, [roundId, user]);

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
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

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
    {pending &&
      <div className={cn("flex justify-center items-center",
        className?.split(" ")
      )}>
        <Loading className="self-center scale-150" />
      </div>
    }
    {!pending && <div className={cn(
      className?.split(" ")
      )}>
      <Canvas className="w-full h-full" onCanvasResize={onCanvasResize} />
    </div>}
  </>);
}