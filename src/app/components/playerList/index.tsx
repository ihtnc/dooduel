"use client";

import { useEffect, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import Player from "@/components/playerDetails";
import client from "@utilities/supabase/browser";
import { getPlayers } from "./actions";
import type { NewPlayerPayload, PlayerDetails, PlayerPayload, PlayerUpdatePayload } from "@types";

export default function PlayerList({ gameId }: { gameId: number }) {
  const user = getUserContext();

  const [hasError, setHasError] = useState(false);
  const [pending, setPending] = useState(true);
  const [players, setPlayers] = useState<Array<PlayerDetails>>([]);

  const sort = (list: Array<PlayerDetails>) =>{
    const player = list.filter(p => p.name.toLowerCase() === user?.player_name.toLowerCase());
    if (player.length > 0) { player[0].name = `${player[0].name} (You)`; }

    const painterIndex = list.findIndex(p => p.is_painter);
    const painter = list.splice(painterIndex, 1);

    const first = list.filter(p => p.active && p.has_answered)
      .sort((a, b) => a.id - b.id);

    const second = list.filter(p => p.active && !p.has_answered && p.current_score > 0)
      .sort((a, b) => a.id - b.id);

    const third = list.filter(p => p.active && !p.has_answered && p.current_score === 0)
      .sort((a, b) => a.id - b.id);

    const fourth = list.filter(p => !p.active)
      .sort((a, b) => a.id - b.id);

    return [...painter, ...first, ...second, ...third, ...fourth];
  };

  useEffect(() => {
    async function fetchGame() {
      const players = await getPlayers(gameId, user?.player_name || '', user?.code || '');
      if (players == null) {
        setHasError(true);
      }

      const sorted = sort(players ?? []);
      setPlayers(sorted);
      setPending(false);
    }

    fetchGame();
  }, [user, gameId]);

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

      const sorted = sort(players);
      setPlayers([...sorted]);
    };

    const handleUpdatePlayer = (payload: PlayerUpdatePayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.active = payload.active;
      player.current_score = payload.current_score;
      player.avatar = payload.avatar;
      const sorted = sort(players);
      setPlayers([...sorted]);
    };

    const handlePlayerAnswered = (payload: PlayerPayload) => {
      const player = players.find((p) => p.id === payload.id);
      if (!player) { return; }

      player.has_answered = true;
      const sorted = sort(players);
      setPlayers([...sorted]);
    };

    const handleRoundStart = (payload: PlayerPayload) => {

      for (const player of players) {
        player.is_painter = player.id === payload.id;
        player.has_answered = false;
        player.current_score = 0;
      }

      const sorted = sort(players);
      setPlayers([...sorted]);
    };

    const channel = client.channel(`game:${gameId}`)
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
        handleRoundStart(msg.payload as unknown as PlayerPayload);
      })
      .subscribe();

    return () => { client.removeChannel(channel); }
  }, [gameId, players]);


  return (
    <div className="flex flex-col items-center w-2xs gap-4">
      <h1 className="text-2xl font-bold">Players</h1>
      {pending && <div>Loading...</div>}
      {hasError && <div>Error loading players</div>}
      <ul className="w-full">
        {players.map((player) => (
          <li key={player.name}>
            <Player player={player} />
          </li>
        ))}
      </ul>
    </div>
  );
}