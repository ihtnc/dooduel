"use client";

import { type PointerEventHandler, useRef } from "react";
import { type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler, use2dAnimatedCanvas } from "@ihtnc/use-animated-canvas";
import { type Brush } from "@types";

export default function GameCanvas({
  getBrush
} : {
  getBrush: () => Brush
}) {
  type Coordinate = { x: number, y: number };

  let currentCoordinate: Coordinate | null = null;
  let startDrawing = false;

  type DrawData = {
    current?: Segment,
    brush: Brush,
    layers: Array<Layer>,
    redrawLayers: boolean,
  };

  type Layer = {
    segments: Record<string, Segment>,
    brush: Brush,
  };

  type Segment = {
    from: Coordinate,
    to: Coordinate,
  };

  const layerCount = useRef(0);

  const initialiseData: InitialiseDataHandler<DrawData> = () => {
    const brush = getBrush();
    return { brush, layers: [], redrawLayers: false };
  }

  const preRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    if (!startDrawing || currentCoordinate == null) {
      data.data = {
        brush: data.data!.brush,
        layers: data.data!.layers,
        redrawLayers: data.data!.redrawLayers,
      };

      layerCount.current = data.data.layers.length;

      return data;
    }

    const brush = getBrush();
    if (data.data!.layers.length === layerCount.current) {
      data.data?.layers.push({
        segments: {},
        brush: { ...brush }
      });
    }

    const { from } = data.data!.current ?? { from: undefined };
    data.data!.current = {
      to: { ...currentCoordinate },
      from: from || { ...currentCoordinate },
    };
    data.data!.brush = { ...brush };

    return data;
  };

  const renderPreviousLayers: AnimatedCanvasRenderFunction<DrawData> = (context, data) => {
    if (data.data!.redrawLayers === false) { return; }
    if (data.data!.layers.length === 0) { return; }

    for (const layer of data.data!.layers) {
      const { brush, segments } = layer;
      if (Object.values(segments).length === 0) { continue; }

      context.strokeStyle = brush.color;
      context.lineCap = "round";

      const width = brush.size * 10;

      for (const segment of Object.values(segments)) {
        const { from, to } = segment;

        if (from.x === to.x && from.y === to.y) {
          context.fillStyle = brush.color;
          context.beginPath();
          context.arc(from.x, from.y, width / 2, 0, 2 * Math.PI);
          context.fill();
          context.closePath();
          continue;
        }

        context.lineWidth = width;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();
        context.closePath();
      }
    }
  };

  const renderCurrent: AnimatedCanvasRenderFunction<DrawData> = (context, data) => {
    if (data.data!.current === undefined) { return; }

    const { brush: b } = data.data!;
    const { from, to } = data.data!.current!;

    context.strokeStyle = b.color;
    context.lineCap = "round";

    const width = b.size * 10;

    if (from.x === to.x && from.y === to.y) {
      context.fillStyle = b.color;

      context.beginPath();
      context.arc(from.x, from.y, width / 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
      return;
    }

    context.lineWidth = width;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.closePath();
  };

  const postRenderTransform: AnimatedCanvasTransformFunction<DrawData> = (data) => {
    if (!startDrawing || data.data!.current === undefined) { return data; }

    const { from, to } = data.data!.current;
    const key = `${from.x},${from.y}-${to.x},${to.y}`;
    const lastLayer = (data.data!.layers!.length > 0) ? data.data!.layers!.slice(-1)[0] : null;
    const { segments } = lastLayer || { segments: {} as Record<string, Segment> };
    if (lastLayer !== null && (Object.values(segments).length === 0 || segments[key] === undefined)) {
      segments[key] = { from: { ...from }, to: { ...to } };
    }

    data.data!.current.from = { ...to };
    data.data!.redrawLayers = false;

    return data;
  }

  const { Canvas } = use2dAnimatedCanvas<DrawData>({
    initialiseData,
    preRenderTransform,
    render: [renderPreviousLayers, renderCurrent],
    postRenderTransform,
    options: { clearEveryFrame: false }
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
    <div className="canvas-container size-166 flex flex-col items-center justify-center">
      <Canvas
        className="border w-full h-full"
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
