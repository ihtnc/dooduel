import Image from "next/image";
import { cn } from "@utilities/index";
import type { AvatarParts } from "./types";

const MAX_HEAD = 5;
const MAX_EYE = 20;
const MAX_MOUTH = 20;

export default function Avatar({
  code,
  alt,
  className,
  containerClassName
}: {
  code?: string;
  alt?: string;
  className?: string,
  containerClassName?: string
}) {
  const parts = parseCode(code);
  const headSrc = getPartSrc("head", parts?.head);
  const eyeSrc = getPartSrc("eye", parts?.eye);
  const mouthSrc = getPartSrc("mouth", parts?.mouth);

  return (
    <div className={cn("relative w-[50px] h-[50px] group", containerClassName)}>
      <Image src={headSrc} alt={alt || "Head"} width={50} height={50}
        className={cn("absolute", "top-0", "left-0", "z-0", className)}
      />
      <Image src={eyeSrc} alt={alt || "Eyes"} width={50} height={50}
        className={cn("absolute", "top-0", "left-0", "z-10", className)} />
      <Image src={mouthSrc} alt={alt || "Mouth"} width={50} height={50}
        className={cn("absolute", "top-0", "left-0", "z-20", className)} />
    </div>
  );
};

export const parseCode = (code?: string): AvatarParts | undefined => {
  if (!code || !/^[0-9]{6}$/.test(code)) { return undefined; }

  const head = parseInt(code[0] + code[1], 10);
  const eye = parseInt(code[2] + code[3], 10);
  const mouth = parseInt(code[4] + code[5], 10);
  if (head === 0 || eye === 0 || mouth === 0) { return undefined; }
  if (head > MAX_HEAD || eye > MAX_EYE || mouth > MAX_MOUTH) { return undefined; }

  return { head, eye, mouth };
};

export const getCode = (parts: AvatarParts): string | undefined => {
  const { head, eye, mouth } = parts;
  if (head < 1 || head > MAX_HEAD) { return undefined; }
  if (eye < 1 || eye > MAX_EYE) { return undefined; }
  if (mouth < 1 || mouth > MAX_MOUTH) { return undefined; }

  return head.toString().padStart(2, "0") +
    eye.toString().padStart(2, "0") +
    mouth.toString().padStart(2, "0");
};

export const getPartSrc = (part: keyof AvatarParts, index?: number): string => {
  const max = getMax(part);
  let id: number;
  if (index === undefined || index < 1 || index > max) {
    id = Math.floor(Math.random() * max) + 1;
  } else {
    id = index;
  }

  return `/avatar/${part}-${id.toString().padStart(2, "0")}.png`;
};

export const getRandomPart = (part: keyof AvatarParts): number => {
  const max = getMax(part);
  const id = Math.floor(Math.random() * max) + 1;
  return id;
};

export const getMax = (part: keyof AvatarParts) => {
  switch (part) {
    case "head": return MAX_HEAD;
    case "eye": return MAX_EYE;
    case "mouth": return MAX_MOUTH;
  }
};