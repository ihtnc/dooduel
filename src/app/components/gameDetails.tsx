import { useState } from "react";
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
  const [showCopyText, setShowCopyText] = useState<boolean>(false);

  const getDifficulty = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Unknown";
    }
  };

  const handleNameClick = () => {
    navigator.clipboard.writeText(game.name);
    setShowCopyText(true);

    setTimeout(() => {
      setShowCopyText(false);
    }, 1500);
  };

  return (
    <div className={cn("flex", "flex-col", "items-center", "justify-center", "w-fit", className?.split(" ") || [])}>
      {game && <>
        <div className="flex items-center h-[50px] w-full relative">
          <span className={
            cn("absolute",
              "font-primary-xl", "text-[color:var(--primary)]", "bg-[color:var(--background)]",
              "transition-opacity", "duration-300", "ease-in",
            showCopyText ? "opacity-100 z-50" : "opacity-0 z-10",
          )}>Copied!</span>
          <h1 className={cn("font-primary-xl", "cursor-pointer",
            "transition-opacity", "duration-300", "ease-out",
            showCopyText ? "opacity-0 z-10 cursor-default pointer-events-none" : "opacity-100 z-50"
          )} onClick={handleNameClick}>{game.name}</h1>
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