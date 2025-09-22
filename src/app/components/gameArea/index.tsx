import { GameStatus } from "@types";

export default function GameArea({ status, isPainter }: { status: GameStatus, isPainter: boolean }) {
  const getTitle = (status: GameStatus) => {
    switch (status) {
      case GameStatus.Initial: return "Waiting for players...";
      case GameStatus.Ready: return "Get ready...";
      case GameStatus.InProgress: return "Let's Dooduel!";
      case GameStatus.Completed: return "Game over!";
    }
  };

  return <div className="flex flex-col items-center gap-4">
    <div><strong>{getTitle(status)}</strong></div>
    <div className="size-168 border-4 border-[#715A5A]">Canvas</div>
    <div>{isPainter ? "Paint Controls" : "Submit Answer" }</div>
  </div>;
};