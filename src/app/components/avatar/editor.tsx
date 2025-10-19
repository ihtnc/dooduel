"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@utilities/index";
import LeftButton from "@/components/button/leftButton";
import RightButton from "@/components/button/rightButton";
import DiceButton from "@/components/button/diceButton";
import { getCode, getMax, getPartSrc, getRandomPart, parseCode } from ".";
import type { AvatarParts } from "./types";

export default function AvatarEditor({
  code,
  onChange,
  className
}: {
  code?: string;
  onChange?: (newCode: string) => void;
  className?: string
}) {
  const [parts, setParts] = useState<AvatarParts>();

  useEffect(() => {
    const parts = parseCode(code);
    setParts(parts);

  }, [code]);

  const getRandomAvatar = () => {
    const head = getRandomPart("head");
    const eye = getRandomPart("eye");
    const mouth = getRandomPart("mouth");
    const newAvatar = { head, eye, mouth };
    const newCode = getCode(newAvatar);
    onChange?.(newCode!);
  };

  const changePart = (part: keyof AvatarParts, delta: number) => {
    if (!parts) { return; }
    const max = getMax(part);
    let newIndex = ((parts[part] || 1) + delta) % (max);
    if (newIndex <= 0) { newIndex = max; }

    const newCode = getCode({ ...parts, [part]: newIndex });
    onChange?.(newCode!);
  }

  return (
    <div className="grid grid-cols-[75px_auto_75px] gap-x-4 items-center">
      <div className="flex-col justify-items-center">
        <LeftButton className="border-0 p-4 hover:border-4" onClick={() => changePart("head", -1)} imageAlt="Change head" />
        <LeftButton className="border-0 p-4 hover:border-4" onClick={() => changePart("eye", -1)} imageAlt="Change eye" />
        <LeftButton className="border-0 p-4 hover:border-4" onClick={() => changePart("mouth", -1)} imageAlt="Change mouth" />
      </div>
      <div className="relative w-[200px] h-[200px] group">
        <Image src={getPartSrc("head", parts?.head)} alt="Head" width={200} height={200}
          className={cn("absolute", "top-0", "left-0", "z-0", className)}
        />
        <Image src={getPartSrc("eye", parts?.eye)} alt="Eyes" width={200} height={200}
          className={cn("absolute", "top-0", "left-0", "z-10", className)} />
        <Image src={getPartSrc("mouth", parts?.mouth)} alt="Mouth" width={200} height={200}
          className={cn("absolute", "top-0", "left-0", "z-20", className)} />
      </div>
      <div className="flex-col items-center justify-items-center">
        <RightButton className="border-0 p-4 hover:border-4" onClick={() => changePart("head", 1)} imageAlt="Change head" />
        <RightButton className="border-0 p-4 hover:border-4" onClick={() => changePart("eye", 1)} imageAlt="Change eye" />
        <RightButton className="border-0 p-4 hover:border-4" onClick={() => changePart("mouth", 1)} imageAlt="Change mouth" />
      </div>
      <div className="col-start-2 mx-auto">
        <DiceButton className="border-0 p-3 hover:border-4 hover:-m-1" onClick={getRandomAvatar} imageAlt="Randomise avatar" />
      </div>
    </div>
  );
};