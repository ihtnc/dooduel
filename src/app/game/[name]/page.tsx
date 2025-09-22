"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import { getPlayers } from "@/components/playerList/actions";
import FlagButton from "@/components/button/flagButton";
import GameArea from "@/components/gameArea";
import client from "@utilities/supabase/browser";
import { getCurrentGame, leaveGame, updateAvatar } from "./actions";
import { GameStatus, type NewPlayerPayload, type PlayerDetails, type CurrentGameDetails, type PlayerUpdatePayload, type PlayerPayload, type RoundStartPayload } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);
  const [players, setPlayers] = useState<Array<PlayerDetails>>([]);
  const [isPainter, setIsPainter] = useState(false);

  const [leaveState, leaveAction, leavePending] = useActionState(leaveGame, undefined);

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCurrentGame(name, user?.player_name || '', user?.code || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      if (game.status === GameStatus.Initial && game.createdBy.toLowerCase() === user?.player_name.toLowerCase()) {
        router.replace(`/lobby/${game.name}`);
        return;
      }

      const players = await getPlayers(game.id, user?.player_name || '', user?.code || '');
      if (players == null) {
        router.replace("/not-found");
        return;
      }

      await updateAvatar(game.id, user?.player_name || '', user?.code || '', user?.avatar || '');

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
        is_painter: false,
        has_answered: false,
        current_score: 0,
      });

      setPlayers([...players]);
    };

    const handleUpdatePlayer = (payload: PlayerUpdatePayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.active = payload.active;
      player.current_score = payload.current_score;
      player.avatar = payload.avatar;
      setPlayers([...players]);
    };

    const handlePlayerAnswered = (payload: PlayerPayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.has_answered = true;
      setPlayers([...players]);
    };

    const handleRoundStart = (payload: RoundStartPayload) => {
      for (const player of players) {
        player.is_painter = player.id === payload.painter_id;
        player.has_answered = false;
        player.current_score = 0;
      }

      setGame((g) => g ? { ...g, status: GameStatus.InProgress } : g);
      setPlayers([...players]);
    };

    const handleRoundReset = () => {
      for (const player of players) {
        player.is_painter = false;
      }

      setGame((g) => g ? { ...g, status: GameStatus.Ready } : g);
      setPlayers([...players]);
    };

    const channel = client.channel(`game:${game?.id}`, {  config: {  } })
      .on("broadcast", { event: "new_player" }, (msg) => {
        handleNewPlayer(msg.payload as unknown as NewPlayerPayload);
      })
      .on("broadcast", { event: "update_player" }, (msg) => {
        handleUpdatePlayer(msg.payload as unknown as PlayerUpdatePayload);
      })
      .on("broadcast", { event: "player_answer" }, (msg) => {
        handlePlayerAnswered(msg.payload as unknown as PlayerPayload);
      })
      .on("broadcast", { event: "round_start" }, (msg) => {
        handleRoundStart(msg.payload as unknown as RoundStartPayload);
      })
      .on("broadcast", { event: "game_ready" }, () => {
        handleRoundReset();
      })
      .on("broadcast", { event: "game_over" }, () => {
        handleRoundReset();
      })
      .subscribe();

    return () => { client.removeChannel(channel); }
  }, [game?.id, players, user?.player_name]);

  useEffect(() => {
    const painter = players.find((p) => p.is_painter);
    setIsPainter(painter?.name.toLowerCase() === user?.player_name.toLowerCase());
  }, [players, user?.player_name]);

  return (
    <div className="flex flex-col align-self-start items-center mt-24">
      {pending && <div>Loading...</div>}
      {game && !pending && <>
        <div className="flex flex-row gap-4">
          <div className="w-168">
            <GameArea status={game.status} isPainter={isPainter} />
          </div>
          <div className="flex flex-col items-center justify-between gap-4 max-w-2xs">
            <div>
              <GameDetails game={game} className="-mt-2" />
              <PlayerList players={players} />
            </div>
            <form action={leaveAction} className="flex">
              <input type="hidden" name="game_name" value={game.name} />
              <input type="hidden" name="player_name" value={user?.player_name} />
              <input type="hidden" name="player_code" value={user?.code} />
              <FlagButton imageAlt="Leave game" className="w-50" disabled={leavePending || !user} type="submit">
                {leavePending ? "Leaving..." : "Leave"}
              </FlagButton>
              {leaveState && <div className="text-red-600">{leaveState.error}</div>}
            </form>
          </div>
        </div>
      </>}
    </div>
  );
}
