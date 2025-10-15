import LockIcon from "@/components/icons/lockIcon";
import EaselIcon from "@/components/icons/easelIcon";
import ArtistIcon from "@/components/icons/artistIcon";
import type { GameDetails } from "@types";
import { cn } from "@utilities/index";

export default function GameDetails({
  game,
  className
}: {
  game: GameDetails,
  className?: string
}) {
  const getDifficulty = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Unknown";
    }
  };

  return (
    <div className={cn("flex", "flex-col", "items-center", "justify-center", "w-fit", className?.split(" ") || [])}>
      {game && <>
        <div className="flex items-center h-[50px] w-full">
          <h1 className="font-bold font-primary-xl">{game.name}</h1>
          {game.hasPassword && <LockIcon alt="Password protected" className="scale-60" />}
        </div>
        <div className="-mt-4 flex items-center w-full gap-4">
          <div className="flex -ml-4 items-center">
            <EaselIcon alt="Number of rounds" className="scale-60 -mr-2" /><strong>: {game.rounds}</strong>
          </div>
          <div className="flex -ml-3 items-center">
            <ArtistIcon alt="Difficulty" className="scale-60 -mr-2" /><strong>: {getDifficulty(game.difficulty)}</strong>
          </div>
        </div>
      </>}
    </div>
  );
};