import Icon from "@/components/icons";
import { cn } from "@utilities/index";

const reactionMap: Record<string, { src: string, alt: string, className?: string }> = {
    "star": { src: "/icons/star.png", alt: "Star" },
    "love": { src: "/icons/heart.png", alt: "Love", className: "-mt-1 mb-1" },
    "like": { src: "/icons/like.png", alt: "Like" },
    "happy": { src: "/icons/happy.png", alt: "Happy" },
    "amused": { src: "/icons/amused.png", alt: "Amused" },
    "surprised": { src: "/icons/surprised.png", alt: "Surprised" },
    "confused": { src: "/icons/confused.png", alt: "Confused" },
    "disappointed": { src: "/icons/disappointed.png", alt: "Disappointed" }
  };

export const getReactionSrc = (reaction: string = "") => reactionMap[reaction]?.src || "/icons/add-emoji.png";
export const getReactionAlt = (reaction: string = "") => reactionMap[reaction]?.alt || "Add Reaction";
export const getReactionClass = (reaction: string = "") => cn(reactionMap[reaction]?.className?.split(" ") || []);

export default function Reaction ({
  reactionType,
  collapsible = false,
  selected = false,
  className = "",
  onClick
}: {
  reactionType: string,
  collapsible?: boolean,
  selected?: boolean,
  className?: string,
  onClick?: (reactionType: string) => void
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