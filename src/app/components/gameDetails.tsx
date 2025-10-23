import { useState } from "react";
import TextOverlay from "@/components/textOverlay";
import LockIcon from "@/components/icons/lockIcon";
import EaselIcon from "@/components/icons/easelIcon";
import ArtistIcon from "@/components/icons/artistIcon";
import MultiplayerIcon from "./icons/multiplayerIcon";
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
  };

  const handleTextHidden = () => {
    setShowCopyText(false);
  };

  return (
    <div className={cn("flex", "flex-col", "items-center", "justify-center", "w-fit", className?.split(" ") || [])}>
      {game && <>
        <TextOverlay
          text="Copied!"
          showText={showCopyText}
          className="flex h-[50px] max-w-2xs w-2xs"
          textClassName={cn("font-primary-xl", "text-[color:var(--primary)]", "bg-[color:var(--background)]")}
          onTextHidden={handleTextHidden}
        >
          <h1 className={cn("font-primary-xl", "cursor-pointer", "truncate")} onClick={handleNameClick}>{game.name}</h1>
          {game.hasPassword && <LockIcon alt="Password protected" className="scale-60" />}
        </TextOverlay>
        <div className="-mt-4 flex items-center max-w-xs w-2xs gap-4 justify-center">
          <div className="flex -ml-4 items-center">
            <EaselIcon alt="Number of rounds" className="scale-60 -mr-2" /><strong>: {game.rounds}</strong>
          </div>
          <div className="flex -ml-3 items-center">
            <ArtistIcon alt="Difficulty" className="scale-60 -mr-2" /><strong>: {getDifficulty(game.difficulty)}</strong>
          </div>
          <div className="flex -ml-4 items-center">
            <MultiplayerIcon alt="Number of players" className="scale-50 -mr-2" /><strong>: {game.playerCount}</strong>
          </div>
        </div>
      </>}
    </div>
  );
};