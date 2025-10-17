"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import BrushButton from "@/components/button/brushButton";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import { getPlayers } from "@/components/playerList/actions";
import Loading from "@/components/loading";
import client from "@utilities/supabase/browser";
import { getCreatedGame, startGame, updateAvatar } from "./actions";
import type { CreatedGameDetails, NewPlayerPayload, PlayerDetails, PlayerUpdatePayload } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [update, action, startPending] = useActionState(startGame, undefined);
  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CreatedGameDetails | null>(null);
  const [players, setPlayers] = useState<Array<PlayerDetails>>([]);

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCreatedGame(name, user?.playerName || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      await updateAvatar(game.id, user?.playerName || '', user?.code || '', user?.avatar || '');

      const players = await getPlayers(game.id, user?.playerName || '', user?.code || '');
      if (players == null) {
        throw new Error("Game has no players");
      }

      setGame(game);
      setPlayers(players);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  useEffect(() => {
    const handleNewPlayer = (payload: NewPlayerPayload) => {
      players.push({
        id: payload.id,
        name: payload.name,
        avatar: payload.avatar,
        active: true,
        isPainter: false,
        hasAnswered: false,
        currentScore: 0,
      });

      setPlayers([...players]);
    };

    const handleUpdatePlayer = (payload: PlayerUpdatePayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.active = payload.active;
      player.currentScore = payload.current_score;
      player.avatar = payload.avatar;
      setPlayers([...players]);
    };

    const channel = client.channel(`game:${game?.id}`, {  config: {  } })
      .on("broadcast", { event: "new_player" }, (msg) => {
        handleNewPlayer(msg.payload as unknown as NewPlayerPayload);
      })
      .on("broadcast", { event: "update_player" }, (msg) => {
        handleUpdatePlayer(msg.payload as unknown as PlayerUpdatePayload);
      })
      .subscribe();

    return () => { client.removeChannel(channel); }
  }, [game, players, user?.playerName]);

  const hasNotEnoughPlayers = players.filter((p) => p.active).length < 2;

  return (
    <div className="flex flex-col align-self-start items-center place-items-start mt-24 gap-4">
      {pending &&
        <div className="flex h-full">
          <Loading className="-mt-16 self-center scale-150" />
        </div>
      }
      {game && !pending && <>
        <GameDetails game={game} />
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="creator" value={user?.playerName} />
          <input type="hidden" name="code" value={game?.code} />
          <BrushButton className="w-50" disabled={startPending || !user || hasNotEnoughPlayers} type="submit" imageAlt="Start game">
            {startPending ? "Starting..." : "Start"}
          </BrushButton>
          {update && <div className="text-red-600">{update.error}</div>}
        </form>
        <PlayerList players={players} title="Players" />
      </>}
    </div>
  );
}
