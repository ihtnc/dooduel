"use client";

import { type PointerEventHandler, useEffect, useRef, useState } from "react";
import { type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler, use2dAnimatedCanvas } from "@ihtnc/use-animated-canvas";
import { getUserContext } from "@/components/userContextProvider";
import { renderSegment } from "@/components/doodle/utilities";
import { getGameCanvas } from "@/components/doodle/actions";
import { drawCanvas } from "./actions";
import type { Segment, Brush, Layer, Coordinate } from "@/components/doodle/types";
import type { CanvasData } from "./types";
import { addRandomOffset } from "./utilities";

export default function GameCanvas({
  roundId,
  getBrush
} : {
  roundId?: number,
  getBrush: () => Brush
}) {
  const SEND_INTERVAL_MS = 500;

  const [pending, setPending] = useState(true);
  const user = getUserContext();
  const layerCount = useRef(0);
  const associatedRoundId = useRef(0);
  const forceRedraw = useRef(!pending);
  const currentCanvas = useRef<Array<Layer>>([]);
  const canvasData = useRef<Array<CanvasData>>([]);

  let currentCoordinate: Coordinate | null = null;
  let startDrawing = false;

  type DrawData = {
    current?: Segment,
    brush: Brush,
    layers: Array<Layer>,
    redrawCanvas: boolean,
  };

  useEffect(() => {
    async function fetchCanvas() {
      if (roundId === undefined) {
        associatedRoundId.current = 0;
        setPending(false);
        return;
      }

      const canvas = await getGameCanvas(roundId, user?.playerName || '', user?.code || '');
      if (canvas) {
        associatedRoundId.current = roundId;
        currentCanvas.current = canvas;
        layerCount.current = canvas.length;
        forceRedraw.current = true;
      }
      setPending(false);
    };

    async function uploadCanvas() {
      const list = canvasData.current.splice(0, canvasData.current.length);
      await drawCanvas(roundId!, user?.playerName || '', user?.code || '', list);
    };

    currentCanvas.current = [];
    layerCount.current = 0;
    forceRedraw.current = true;
    fetchCanvas();

    const uploader = setInterval(() => {
      if (roundId === undefined) { return; }
      if (canvasData.current.length === 0) { return; }

      uploadCanvas();
    }, SEND_INTERVAL_MS);

    return () => {
      clearInterval(uploader);
    };
  }, [roundId, user]);

  if (roundId !== associatedRoundId.current) {
    currentCanvas.current = [];
    layerCount.current = 0;
    canvasData.current = [];
  }

  forceRedraw.current = !pending;

  const initialiseData: InitialiseDataHandler<DrawData> = () => {
    if (roundId === undefined) {
      currentCanvas.current = [];
      layerCount.current = 0;
    }

    const brush = getBrush();
    return { brush, layers: currentCanvas.current, redrawCanvas: currentCanvas.current.length > 0 };
  }

  const preRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    data.data!.redrawCanvas = data.data!.redrawCanvas || forceRedraw.current;
    forceRedraw.current = false;

    if (data.data!.redrawCanvas) {
      data.data!.layers = currentCanvas.current;
    }

    if (!startDrawing || currentCoordinate == null) {
      data.data = {
        brush: data.data!.brush,
        layers: data.data!.layers,
        redrawCanvas: data.data!.redrawCanvas,
      };

      layerCount.current = data.data.layers.length;

      return data;
    }

    const brush = getBrush();
    if (data.data!.layers.length === layerCount.current) {
      data.data?.layers.push({
        segments: [],
        brush: { ...brush }
      });
    }

    const { to } = data.data!.current ?? { to: undefined };
    // add slight offset on first point to ensure a dot is drawn
    const firstPoint = addRandomOffset(currentCoordinate);
    data.data!.current = {
      to: { ...currentCoordinate },
      from: to || firstPoint,
    };
    data.data!.brush = { ...brush };

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
    if (data.data!.current === undefined) { return; }

    context.save();
    const { brush, current } = data.data!;
    renderSegment(context, brush, current!);
    context.restore();
  };

  const postRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    data.data!.redrawCanvas = false;

    if (!startDrawing || data.data!.current === undefined) { return data; }

    let lastLayer = (data.data!.layers.length > 0) ? data.data!.layers![data.data!.layers.length - 1] : null;
    if (!lastLayer) {
      lastLayer = { brush: data.data!.brush, segments: [] };
      data.data!.layers.push(lastLayer);
    }

    const { from, to } = data.data!.current;
    const isDifferentCoordinate = from.x !== to.x || from.y !== to.y;
    if (isDifferentCoordinate) {
      lastLayer.segments.push(data.data!.current);
      canvasData.current.push({ segment: data.data!.current, brush: data.data!.brush });
    }

    return data;
  }

  const { Canvas } = use2dAnimatedCanvas<DrawData>({
    initialiseData,
    preRenderTransform,
    render: [renderCurrentCanvas, renderUpdate],
    postRenderTransform,
    options: { clearEveryFrame: false, protectData: false }
  });

  const handlePointerDown: PointerEventHandler<HTMLCanvasElement> = () => {
    startDrawing = true;
  };

  const handlePointerUp: PointerEventHandler<HTMLCanvasElement> = () => {
    startDrawing = false;
  };

  const handlePointerMove: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    currentCoordinate = { x, y };
  };

  const handlePointerOut: PointerEventHandler<HTMLCanvasElement> = () => {
    currentCoordinate = null;
    startDrawing = false;
  };

  const handlePointerEnter: PointerEventHandler<HTMLCanvasElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    currentCoordinate = { x, y };
    startDrawing = false;
  };

  return (<>
    <div className="size-166">
      <Canvas
        className="border w-full h-full cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerEnter={handlePointerEnter}
      />
    </div>
  </>
  );
};
