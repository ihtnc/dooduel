import Avatar from "@/components/avatar";
import CheckIcon from "@/components/icons/checkIcon";
import BrushIcon from "@/components/icons/brushIcon";
import { cn } from "@utilities/index";
import type { PlayerDetails } from "@types";

export default function PlayerDetails({
  player
}: {
  player: PlayerDetails
}) {
  return (
    <div className={cn("flex", "flex-col", "w-full", {
      "line-through": !player?.active,
      "opacity-50": !player?.active
    })}>
      {!player && <div>No player selected</div>}
      {player && <>
        <div className="flex h-8 items-center w-full">
          {<Avatar alt={`${player.name} avatar`} code={player.avatar} className="scale-60" />}
          <span className="-ml-2">{player.name}</span>
          {player.isPainter && <span className="-ml-2"><BrushIcon alt="Currently doodling" className="scale-50" /></span>}
          {player.currentScore === 0 && player.hasAnswered && <span className="ml-auto"><CheckIcon alt="Has answered" className="scale-50" /></span>}
          {player.currentScore > 0 && <span className="ml-auto">{Math.floor(player.currentScore)}</span>}
        </div>
      </>}
    </div>
  );
};