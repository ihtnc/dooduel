import Icon from "@/components/icons";
import { GameReaction } from "@types";
import { cn, getGameReactionAlt, getGameReactionSrc } from "@utilities/index";

const reactionMap: Record<string, string> = {
  [GameReaction.Love]: "-mt-1 mb-1"
};

export const getReactionSrc = (reaction: GameReaction | null) => reaction ? getGameReactionSrc(reaction) || "/icons/add-emoji.png" : "/icons/add-emoji.png";
export const getReactionAlt = (reaction: GameReaction | null) => reaction ? getGameReactionAlt(reaction) || "Add Reaction" : "Add Reaction";
export const getReactionClass = (reaction: GameReaction | null) => cn(reaction ? reactionMap[reaction]?.split(" ") || [] : []);

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
    { "pb-1 border-[color:var(--primary)] border-b-4 rounded-sm": selected && !collapsible },
    className
  )}>
    <Icon
      src={getReactionSrc(reactionType)}
      alt={getReactionAlt(reactionType)}
      className={cn(
        { "scale-70 group-hover:scale-100": collapsible },
        { "scale-90 group-hover:scale-120": !collapsible },
        { "scale-120": selected && !collapsible }
      )}
      onClick={() => onClick?.(reactionType)}
    />
  </div>;
};