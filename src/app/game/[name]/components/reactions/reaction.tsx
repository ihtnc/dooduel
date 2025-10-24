import Icon from "@/components/icons";
import { GameReaction } from "@types";
import { cn } from "@utilities/index";

const reactionMap: Record<string, { src: string, alt: string, className?: string }> = {
    [GameReaction.Star]: { src: "/icons/star.png", alt: "Star" },
    [GameReaction.Love]: { src: "/icons/heart.png", alt: "Love", className: "-mt-1 mb-1" },
    [GameReaction.Like]: { src: "/icons/like.png", alt: "Like" },
    [GameReaction.Happy]: { src: "/icons/happy.png", alt: "Happy" },
    [GameReaction.Amused]: { src: "/icons/amused.png", alt: "Amused" },
    [GameReaction.Surprised]: { src: "/icons/surprised.png", alt: "Surprised" },
    [GameReaction.Confused]: { src: "/icons/confused.png", alt: "Confused" },
    [GameReaction.Disappointed]: { src: "/icons/disappointed.png", alt: "Disappointed" }
  };

export const getReactionSrc = (reaction: GameReaction | null) => reaction ? reactionMap[reaction]?.src || "/icons/add-emoji.png" : "/icons/add-emoji.png";
export const getReactionAlt = (reaction: GameReaction | null) => reaction ? reactionMap[reaction]?.alt || "Add Reaction" : "Add Reaction";
export const getReactionClass = (reaction: GameReaction | null) => cn(reaction ? reactionMap[reaction]?.className?.split(" ") || [] : []);

export default function Reaction ({
  reactionType,
  collapsible = false,
  selected = false,
  className = "",
  onClick
}: {
  reactionType: GameReaction | null,
  collapsible?: boolean,
  selected?: boolean,
  className?: string,
  onClick?: (reactionType: GameReaction | null) => void
}) {
  return <div className={cn("cursor-pointer", "group",
    selected && !collapsible ? "pb-1 border-[color:var(--primary)] border-b-4" : "",
    className
  )}>
    <Icon
      src={getReactionSrc(reactionType)}
      alt={getReactionAlt(reactionType)}
      className={cn(
        collapsible ? "scale-70 group-hover:scale-100" : "scale-90 group-hover:scale-120",
        selected && !collapsible ? "scale-120 " : ""
      )}
      onClick={() => onClick?.(reactionType)}
    />
  </div>;
};