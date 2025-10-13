import { useState } from "react";
import BigDotIcon from "@/components/icons/bigDotIcon";
import PaintCanIcon from "@/components/icons/paintCanIcon";
import SmallDotIcon from "@/components/icons/smallDotIcon";
import Slider from "@/components/slider";
import { cn } from "@utilities/index";
import { Brush } from "./types";

export const DEFAULT_BRUSH: Brush = {
  size: 1,
  color: "#000000"
};

export default function BrushOptions({
  onChange,
}: {
  onChange?: (brush: Brush) => void;
}) {
  const [selectedBrush, setSelectedBrush] = useState<Brush>(DEFAULT_BRUSH);
  const [selectedColor, setSelectedColor] = useState("black");

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrush = { size: parseInt(e.target.value, 10), color: selectedBrush.color };
    if (newBrush.size < 1) { newBrush.size = 1; }
    else if (newBrush.size > 3) { newBrush.size = 3; }

    setSelectedBrush(newBrush);
    onChange?.(newBrush);
  }

  const handleBrushColorChange = (color: string) => {
    const newBrush = { size: selectedBrush.size, color };
    for (const color of Object.keys(colorMap)) {
      const item = colorMap[color];
      if (item.value === newBrush.color) {
        setSelectedColor(color);
        setSelectedBrush(newBrush);
        onChange?.(newBrush);
        break;
      }
    }
  }

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex flex-row items-center gap-2">
        <SmallDotIcon alt="Small brush" className="-mt-2" />
        <Slider min={1} max={3} step={1} value={selectedBrush.size}
          onInput={handleBrushSizeChange}
          className="-ml-3 -mr-2 w-45"
        />
        <BigDotIcon alt="Big brush" className="scale-75" />
      </div>
      <div className="flex flex-grow border-4 border-[color:var(--primary)] rounded-xl gap-4 justify-center items-center">
        <PaintCanIcon alt="Brush color" className="scale-75 -ml-3 -mr-2" />
        <ColorButton color="black" onClick={handleBrushColorChange} selected={selectedColor === "black"} />
        <ColorButton color="white" onClick={handleBrushColorChange} selected={selectedColor === "white"} />
        <ColorButton color="red" onClick={handleBrushColorChange} selected={selectedColor === "red"} />
        <ColorButton color="blue" onClick={handleBrushColorChange} selected={selectedColor === "blue"} />
        <ColorButton color="yellow" onClick={handleBrushColorChange} selected={selectedColor === "yellow"} />
        <ColorButton color="green" onClick={handleBrushColorChange} selected={selectedColor === "green"} />
      </div>
    </div>
  );
};

const colorMap: Record<string, { class: string, value: string}> = {
  "red": { class: "bg-red-700", value: "#C10007" },
  "blue": { class: "bg-blue-700", value: "#1447E6" },
  "green": { class: "bg-green-700", value: "#008236" },
  "yellow": { class: "bg-yellow-500", value: "#F0B100" },
  "black": { class: "bg-black", value: "#37353E" },
  "white": { class: "bg-white border", value: "#FFFFFF" },
};

const ColorButton = ({
  color,
  onClick,
  selected = false,
}: {
  color: "red" | "blue" | "green" | "yellow" | "black" | "white";
  onClick?: (color: string) => void;
  selected?: boolean;
}) => {
  return (
    <button
      onClick={() => onClick?.(colorMap[color].value)}
      className={cn("size-8", "cursor-pointer", "rounded-full",
        "hover:size-10", "hover:-mx-1", selected ? "ring-4 ring-[color:var(--primary)] size-9 -mx-0.5" : "" ,
        colorMap[color].class,
      )}
    />
  );
}
