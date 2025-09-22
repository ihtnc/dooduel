"use client";

import Player from "@/components/playerDetails";
import { getUserContext } from "@/components/userContextProvider";
import type { PlayerDetails } from "@types";

export default function PlayerList({ players, title }: { players: Array<PlayerDetails>, title?: string }) {
  const user = getUserContext();
  const list = [...players];

  // get current player
  const playerIndex = list.findIndex(p => p.name.toLowerCase() === (user?.playerName?.toLowerCase() || ""));
  const player = playerIndex < 0 ? null : { ...list.splice(playerIndex, 1)[0] };
  if (player) { player.name = `${player.name} (You)`; }

  // get current painter if not the player
  let painter: PlayerDetails | null = null;
  if (!player?.isPainter) {
    const painterIndex = list.findIndex(p => p.isPainter);
    painter = painterIndex < 0 ? null : list.splice(painterIndex, 1)[0];
  }

  // show those who have answered first
  const first = list.filter(p => p.active && p.hasAnswered)
    .sort((a, b) => a.id - b.id);

  // then those who have scores
  const second = list.filter(p => p.active && !p.hasAnswered && p.currentScore > 0)
    .sort((a, b) => a.id - b.id);

  // then those who are at least active
  const third = list.filter(p => p.active && !p.hasAnswered && p.currentScore === 0)
    .sort((a, b) => a.id - b.id);

  // then those who are inactive
  const fourth = list.filter(p => !p.active)
    .sort((a, b) => a.id - b.id);

  // the player and/or painter always goes at the top
  const top: Array<PlayerDetails> = [];
  if (painter) { top.push(painter); }
  if (player) { top.push(player); }

  const sorted = [...top, ...first, ...second, ...third, ...fourth];

  return (
    <div className="flex flex-col items-center min-w-2xs gap-4">
      {title && <div className="text-center mt-4 -mb-2"><h1 className="text-2xl font-bold">{title}</h1></div>}
      <ul className="w-full border-t-4 border-t-[#715A5A] pt-2">
        {sorted.map((player) => (
          <li key={player.name}>
            <Player player={player} />
          </li>
        ))}
      </ul>
    </div>
  );
}