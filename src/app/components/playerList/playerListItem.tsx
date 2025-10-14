import Avatar from "@/components/avatar";
import CheckIcon from "@/components/icons/checkIcon";
import BrushIcon from "@/components/icons/brushIcon";
import { cn } from "@utilities/index";
import type { PlayerDetails } from "@types";

export default function PlayerListItem({
  player,
  className = ""
}: {
  player: PlayerDetails,
  className?: string
}) {
  return (
    <div className={cn("flex", "flex-col", "w-full", {
      "line-through": !player?.active,
      "opacity-50": !player?.active
    })}>
      {!player && <div>No player selected</div>}
      {player && <>
        <div className={cn("flex", "h-8", "items-center", "w-full", "gap-2", ...className.split(" "))}>
          {<Avatar alt={`${player.name} avatar`} code={player.avatar} className="scale-60" />}
          <span className="-ml-4">{player.name}</span>
          {player.isPainter && <span className="-ml-4 -mr-3"><BrushIcon alt="Currently doodling" className="scale-50" /></span>}
          {player.currentScore === 0 && player.hasAnswered && <span className="-ml-3 -mr-1"><CheckIcon alt="Has answered" className="scale-50" /></span>}
          {player.currentScore > 0 && <span className="ml-auto pr-2">{Math.floor(player.currentScore)}</span>}
        </div>
      </>}
    </div>
  );
};