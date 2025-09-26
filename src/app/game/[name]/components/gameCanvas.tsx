"use client";

import { PointerEventHandler } from "react";
import { type AnimatedCanvasRenderFunction, type AnimatedCanvasTransformFunction, type InitialiseDataHandler, use2dAnimatedCanvas } from "@ihtnc/use-animated-canvas";
import { DEFAULT_BRUSH } from "./brushOptions";
import { Brush } from "@types";

export default function GameCanvas({
  brush = DEFAULT_BRUSH
} : {
  brush?: Brush
}) {
  type Coordinate = { x: number, y: number };

  const coordinateMap: Map<string, DrawData> = new Map();
  let layerCount = 0;
  let currentCoordinate: Coordinate | null = null;
  let startDrawing = false;

  type DrawData = {
    coordinate: Coordinate,
    brush: Brush
  };

  const groupByColor = (brushData: Array<Array<DrawData>>): Array<Map<string, Array<DrawData>>> => {
    const colorMap: Array<Map<string, Array<DrawData>>> = [];

    for (const layer of brushData) {
      const layerMap = new Map<string, Array<DrawData>>();
      for (const value of layer) {
        if (!layerMap.has(value.brush.color)) {
          layerMap.set(value.brush.color, []);
        }
        layerMap.get(value.brush.color)!.push({ ...value });
      }
      colorMap.push(layerMap);
    }

    return colorMap;
  };

  const initialiseData: InitialiseDataHandler<Array<Array<DrawData>>> = () => {
    return [];
  }

  const preRenderTransform: AnimatedCanvasTransformFunction<Array<Array<DrawData>>> = (data) => {
    const newData = data.data ?? [];

    if (!startDrawing) {
      if (layerCount !== newData.length) { layerCount = newData.length; }
      return data;
    }

    if (layerCount === newData.length) { newData.push([]); }

    const currentLayer = newData.length > 0 ? newData[newData.length - 1] : [];

    if (startDrawing && currentCoordinate !== null) {
      const { x, y } = currentCoordinate;
      const key = `${x},${y}`;

      let addNewData = true;
      if (coordinateMap.has(key)) {
        const existing = coordinateMap.get(key)!;
        if (existing.brush.size === brush.size && existing.brush.color === brush.color) {
          addNewData = false;
        } else {
          const index = currentLayer.indexOf(existing);
          if (index >= 0) { currentLayer.splice(index, 1); }
          coordinateMap.delete(key);
        }
      }

      if (addNewData) {
        const item: DrawData | null = { coordinate: { x, y }, brush: { ...brush } };
        currentLayer.push(item);
        coordinateMap.set(key, item);
      }
    }

    data.data = newData;
    return data;
  };

  const render: AnimatedCanvasRenderFunction<Array<Array<DrawData>>> = (context, data) => {
    const colorMap = groupByColor(data.data ?? []);
    for (const layer of colorMap) {
      for (const [key, value] of layer) {
        context.strokeStyle = key;
        context.lineCap = "round";

        let previousCoordinate: Coordinate | null = null;
        for (const item of value) {
          const width = item.brush.size * 10;

          if (previousCoordinate == null) {
            previousCoordinate = item.coordinate;
            context.fillStyle = key;

            context.beginPath();
            context.arc(item.coordinate.x, item.coordinate.y, width / 2, 0, 2*Math.PI);
            context.fill();
            context.closePath();
            continue;
          }

          context.lineWidth = width;
          context.beginPath();
          context.moveTo(previousCoordinate.x, previousCoordinate.y);
          context.lineTo(item.coordinate.x, item.coordinate.y);
          context.stroke();
          context.closePath();
          previousCoordinate = item.coordinate;
        }
      }
    }
  };;

  const { Canvas } = use2dAnimatedCanvas<Array<Array<DrawData>>>({
    initialiseData,
    preRenderTransform,
    render
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
