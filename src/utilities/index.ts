import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { GameReaction } from "@types";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
};

export const getGameReactionSrc = (reaction: GameReaction): string => reactionMap[reaction]?.src;
export const getGameReactionAlt = (reaction: GameReaction): string => reactionMap[reaction]?.alt;

const reactionMap: Record<string, { src: string, alt: string }> = {
  [GameReaction.Star]: { src: "/icons/star.png", alt: "Star" },
  [GameReaction.Love]: { src: "/icons/heart.png", alt: "Love" },
  [GameReaction.Like]: { src: "/icons/like.png", alt: "Like" },
  [GameReaction.Happy]: { src: "/icons/happy.png", alt: "Happy" },
  [GameReaction.Amused]: { src: "/icons/amused.png", alt: "Amused" },
  [GameReaction.Surprised]: { src: "/icons/surprised.png", alt: "Surprised" },
  [GameReaction.Confused]: { src: "/icons/confused.png", alt: "Confused" },
  [GameReaction.Disappointed]: { src: "/icons/disappointed.png", alt: "Disappointed" }
};