import Avatar from "@/components/avatar";
import Doodle from "@/components/doodle";
import Icon from "@/components/icons";
import { GameReaction, type GameCanvasShowcaseDetails } from "@types";
import { cn, getGameReactionAlt, getGameReactionSrc } from "@utilities/index";

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
        { "w-60": expand },
        { "max-w-60": expand },
        { "hover:scale-110": !expand },
        { "cursor-pointer": onClick && !expand },
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
      <Doodle roundId={item.roundId} className="size-50 border-0" />
      <span className={cn("flex", "gap-1", "h-16",
        "flex-wrap", "justify-center",
        { "hidden": !expand }
      )}>
        <ReactionCount reaction={GameReaction.Star} count={item.starCount || 0} />
        <ReactionCount reaction={GameReaction.Love} count={item.loveCount || 0} />
        <ReactionCount reaction={GameReaction.Like} count={item.likeCount || 0} />
        <ReactionCount reaction={GameReaction.Happy} count={item.happyCount || 0} />
        <ReactionCount reaction={GameReaction.Amused} count={item.amusedCount || 0} />
        <ReactionCount reaction={GameReaction.Surprised} count={item.surprisedCount || 0} />
        <ReactionCount reaction={GameReaction.Confused} count={item.confusedCount || 0} />
        <ReactionCount reaction={GameReaction.Disappointed} count={item.disappointedCount || 0} />
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