"use client";

import { useEffect, useRef, useState } from "react";
import { type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler, use2dAnimatedCanvas } from "@ihtnc/use-animated-canvas";
import { getUserContext } from "@/components/userContextProvider";
import client from "@utilities/supabase/browser";
import { getGameCanvas } from "./actions";
import { renderSegment } from "./utilities";
import type { CanvasUpdatePayload } from "@types";
import type { Layer, CanvasData, Brush, Segment } from "./types";

export default function ReadOnlyGameCanvas({
  gameId,
  roundId
} : {
  gameId: number,
  roundId?: number
}) {
  const [pending, setPending] = useState(true);
  const user = getUserContext();
  const currentCanvas = useRef<Array<Layer>>([]);
  const currentData = useRef<Array<CanvasData>>([]);
  const forceRedraw = useRef(!pending);

  type DrawData = {
    layers: Array<Layer>,
    update: CanvasData | null,
    redrawCanvas: boolean,
  };

  useEffect(() => {
    const handleUpdateCanvas = (payload: CanvasUpdatePayload) => {
      const brush: Brush = { size: payload.brush_size, color: payload.brush_color };
      const segment: Segment = { from: { x: payload.from_x, y: payload.from_y }, to: { x: payload.to_x, y: payload.to_y } };
      currentData.current.push({ brush, segment });
    };

    const channel = client.channel(`game:${gameId}:round:${roundId}`, { config: { private: true } })
      .on("broadcast", { event: "update_canvas" }, (msg) => {
        handleUpdateCanvas(msg.payload as unknown as CanvasUpdatePayload);
      }).subscribe();

    async function fetchCanvas() {
      if (roundId === undefined) {
        setPending(false);
        return;
      }

      const canvas = await getGameCanvas(roundId, user?.playerName || '', user?.code || '');
      if (canvas) {
        currentCanvas.current = canvas;
        forceRedraw.current = true;
      }
      setPending(false);
    };

    currentCanvas.current = [];
    currentData.current = [];
    forceRedraw.current = true;
    fetchCanvas();

    return () => { client.removeChannel(channel); }
  }, [gameId, roundId, user]);

  forceRedraw.current = !pending;

  const initialiseData: InitialiseDataHandler<DrawData> = () => {
    return { layers: currentCanvas.current, redrawCanvas: currentCanvas.current.length > 0, update: null };
  }

  const preRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    data.data!.redrawCanvas = data.data!.redrawCanvas || forceRedraw.current;
    forceRedraw.current = false;

    if (data.data!.redrawCanvas) {
      data.data!.layers = [...currentCanvas.current];
    }

    if (currentData.current.length > 0) {
      data.data!.update = currentData.current.shift() || null;
    }

    return data;
  };

  const renderCurrentCanvas: AnimatedCanvasRenderFunction<DrawData> = (context, data) => {
    if (data.data!.redrawCanvas === false) { return; }

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

  const renderUpdate: AnimatedCanvasRenderFunction<DrawData> = (context, data) => {
    if (data.data!.update === null) { return; }

    context.save();
    const { brush, segment } = data.data!.update;
    renderSegment(context, brush, segment);
    context.restore();
  };

  const postRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    if (data.data!.update !== null) {
      let lastLayer = currentCanvas.current.length > 0 ? currentCanvas.current[currentCanvas.current.length - 1] : null;
      const sameBrush = lastLayer?.brush.color === data.data!.update.brush.color && lastLayer?.brush.size === data.data!.update.brush.size;

      if (!lastLayer || !sameBrush) {
        lastLayer = { brush: data.data!.update.brush, segments: [] };
        currentCanvas.current.push(lastLayer);
      }

      lastLayer.segments.push(data.data!.update.segment);
    }

    data.data!.update = null;
    data.data!.redrawCanvas = false;
    return data;
  }

  const { Canvas } = use2dAnimatedCanvas<DrawData>({
    initialiseData,
    preRenderTransform,
    render: [renderCurrentCanvas, renderUpdate],
    postRenderTransform,
    options: { clearEveryFrame: false, protectData: false }
  });

  return (<>
    <div className="canvas-container size-166 flex flex-col items-center justify-center">
      <Canvas
        className="border w-full h-full"
      />
    </div>
  </>
  );
};
