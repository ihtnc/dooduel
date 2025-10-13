"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import GameDetails from "@/components/gameDetails";
import PlayerList from "@/components/playerList";
import { getPlayers } from "@/components/playerList/actions";
import LeaveGame from "@/components/leaveGame";
import client from "@utilities/supabase/browser";
import GameArea from "./components/gameArea";
import { getCurrentGame, updateAvatar } from "./actions";
import { GameStatus, type NewPlayerPayload, type PlayerDetails, type CurrentGameDetails, type PlayerUpdatePayload, type PlayerPayload, type RoundStartPayload } from "@types";

export default function GamePage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);
  const [players, setPlayers] = useState<Array<PlayerDetails>>([]);
  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [refreshKey, setRefreshKey] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCurrentGame(name, user?.playerName || '', user?.code || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      if (game.status === GameStatus.Initial && game.createdBy.toLowerCase() === user?.playerName.toLowerCase()) {
        router.replace(`/lobby/${game.name}`);
        return;
      }

      const players = await getPlayers(game.id, user?.playerName || '', user?.code || '');
      if (players == null) {
        router.replace("/not-found");
        return;
      }

      await updateAvatar(game.id, user?.playerName || '', user?.code || '', user?.avatar || '');

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

    const handlePlayerAnswered = (payload: PlayerPayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.hasAnswered = true;
      setPlayers([...players]);
    };

    const handleRoundStart = (payload: RoundStartPayload) => {
      for (const player of players) {
        player.isPainter = player.id === payload.painter_id;
        player.hasAnswered = false;
        player.currentScore = 0;
      }

      setGame((g) => g ? { ...g, status: GameStatus.InProgress } : g);
      setPlayers([...players]);
    };

    const handleGameReady = () => {
      for (const player of players) {
        player.isPainter = false;
      }

      setGame((g) => g ? { ...g, status: GameStatus.Ready } : g);
      setPlayers([...players]);
    };

    const handleTurnEnd = () => {
      for (const player of players) {
        player.isPainter = false;
      }

      setGame((g) => g ? { ...g, status: GameStatus.TurnEnd } : g);
      setPlayers([...players]);
    };

    const handleRoundEnd = () => {
      for (const player of players) {
        player.isPainter = false;
      }

      setGame((g) => g ? { ...g, status: GameStatus.RoundEnd } : g);
      setPlayers([...players]);
    };

    const handleGameOver = () => {
      for (const player of players) {
        player.isPainter = false;
      }

      setGame((g) => g ? { ...g, status: GameStatus.Completed } : g);
      setPlayers([...players]);
    };

    const handlePurgeGame = () => {
      router.replace("/");
    };

    const channel = client.channel(`game:${game?.id}`)
      .on("broadcast", { event: "new_player" }, (msg) => {
        handleNewPlayer(msg.payload as unknown as NewPlayerPayload);
        setRefreshKey(new Date());
      })
      .on("broadcast", { event: "update_player" }, (msg) => {
        handleUpdatePlayer(msg.payload as unknown as PlayerUpdatePayload);
        setRefreshKey(new Date());
      })
      .on("broadcast", { event: "player_answer" }, (msg) => {
        handlePlayerAnswered(msg.payload as unknown as PlayerPayload);
      })
      .on("broadcast", { event: "round_start" }, (msg) => {
        handleRoundStart(msg.payload as unknown as RoundStartPayload);
      })
      .on("broadcast", { event: "game_ready" }, () => {
        handleGameReady();
      })
      .on("broadcast", { event: "turn_end" }, () => {
        handleTurnEnd();
      })
      .on("broadcast", { event: "round_end" }, () => {
        handleRoundEnd();
      })
      .on("broadcast", { event: "game_over" }, () => {
        handleGameOver();
      })
      .on("broadcast", { event: "purge_game" }, () => {
        handlePurgeGame();
      })
      .subscribe();

    return () => { client.removeChannel(channel); }
  }, [game?.id, players, user?.playerName, router]);

  useEffect(() => {
    const player = players.find((p) => p.name.toLowerCase() === user?.playerName.toLowerCase());
    setPlayer(player || null);
  }, [players, user?.playerName]);

  return (
    <div className="flex flex-col align-self-start items-center mt-24">
      {pending && <div>Loading...</div>}
      {game && player && !pending && <>
        <div className="flex flex-row gap-4">
          <div className="w-168">
            <GameArea game={game} player={player} refreshKey={refreshKey} />
          </div>
          <div className="flex flex-col items-center justify-between gap-4 max-w-2xs">
            <div>
              <GameDetails game={game} className="-mt-2" />
              <PlayerList players={players} />
            </div>
            <LeaveGame game={game} className="mb-18.5" />
          </div>
        </div>
      </>}
    </div>
  );
}
