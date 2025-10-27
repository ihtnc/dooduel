import Avatar from "@/components/avatar";
import Doodle from "@/components/doodle";
import Icon from "@/components/icons";
import { cn, getGameReactionAlt, getGameReactionSrc } from "@utilities/index";
import { GameReaction } from "@types";
import type { GameCanvasShowcaseDetails } from "./types";

export default function ShowcaseItem({
  item,
  expand = false,
  onClick,
  className
} : {
  item: GameCanvasShowcaseDetails,
  expand?: boolean,
  onClick?: () => void,
  className?: string
}) {
  return <div className={
    cn("flex", "flex-col", "items-center", "justify-center",
        "w-48", "max-w-48",
        "hover:scale-110",
        { "w-60": expand },
        { "max-w-60": expand },
        { "cursor-pointer": !expand || onClick },
        className
    )}
    onClick={onClick}
  >
    <h3 className="font-primary-lg">{item.category}</h3>
    <div className="flex flex-col items-center justify-center border-4 border-[var(--primary)] pt-2 pb-2 rounded-lg w-full">
      <span className={cn("font-bold font-primary text-[var(--primary)]",
        { "border-b-4 rounded-sm w-38 text-center": !expand }
      )}>
        &quot;{item.word}&quot;
      </span>
      <span className={cn("-mt-2 flex flex-row items-center",
        { "hidden": !expand }
      )}>
        by
        &nbsp;
        <Avatar code={item.painterAvatar} className="size-8" containerClassName="size-8 my-1" />
        &nbsp;
        {item.painterName}
      </span>
      <span className={cn("-mt-1 flex flex-row w-50 justify-center items-center border-b-4 border-[var(--primary)] rounded-sm pb-2",
        { "hidden": !expand }
      )}>
        ({item.painterScore} points)
      </span>
      <Doodle canvas={item.canvasData}
        className={cn("border-0",
          { "size-50": expand },
          { "size-40": !expand },
          { "mb-1": !expand }
        )} />
      <span className={cn("flex", "gap-2", "h-16",
        "flex-wrap", "justify-center",
        { "hidden": !expand || Object.keys(item.data).length === 0 }
      )}>
        {Object.entries(item.data).map(([key, value]) => (
          <span key={key} className="flex items-center">
            [{key}:&nbsp;{value}]
          </span>
        ))}
      </span>
      <span className={cn("flex", "gap-1", "h-16",
        "flex-wrap", "justify-center",
        { "hidden": !expand || Object.keys(item.data).length > 0 }
      )}>
        <ReactionCount reaction={GameReaction.Star} count={item.starCount} />
        <ReactionCount reaction={GameReaction.Love} count={item.loveCount} />
        <ReactionCount reaction={GameReaction.Like} count={item.likeCount} />
        <ReactionCount reaction={GameReaction.Happy} count={item.happyCount} />
        <ReactionCount reaction={GameReaction.Amused} count={item.amusedCount} />
        <ReactionCount reaction={GameReaction.Surprised} count={item.surprisedCount} />
        <ReactionCount reaction={GameReaction.Confused} count={item.confusedCount} />
        <ReactionCount reaction={GameReaction.Disappointed} count={item.disappointedCount} />
      </span>
    </div>
  </div>;
};

const ReactionCount = ({
  reaction,
  count
}: {
  reaction: GameReaction,
  count: number
}) => {
  if (count === 0) { return null; }

  return <span className="flex items-center">
    <Icon src={getGameReactionSrc(reaction)} alt={getGameReactionAlt(reaction)} className="size-8" />
    :&nbsp;{count}
  </span>
};