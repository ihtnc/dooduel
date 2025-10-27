"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserContext } from "@/components/userContextProvider";
import LeaveGame from "@/components/leaveGame";
import Loading from "@/components/loading";
import TrophyButton from "@/components/button/trophyButton";
import PodiumButton from "@/components/button/podiumButton";
import PortraitIcon from "@/components/icons/portraitIcon";
import LeftButton from "@/components/button/leftButton";
import RightButton from "@/components/button/rightButton";
import Fullview from "./fullview";
import ShowcaseItem from "./showcaseItem";
import { getCurrentGame } from "@/actions";
import { getGameCanvasShowcase } from "./actions";
import { cn } from "@utilities/index";
import { chooseShowcaseItems } from "./utilities";
import { GameStatus, type CurrentGameDetails } from "@types";
import type { GameCanvasShowcaseDetails } from './types';

export default function GalleryPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const user = getUserContext();

  const [pending, setPending] = useState(true);
  const [game, setGame] = useState<CurrentGameDetails | null>(null);
  const [showcase, setShowcase] = useState<Array<GameCanvasShowcaseDetails>>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [fullviewIndex, setFullviewIndex] = useState(-1);

  const normaliseIndex = (index: number) => {
    if (showcase.length === 0) {
      return -1;
    }
    return (index + showcase.length) % showcase.length;
  }

  const handlePrevClick = () => {
    if (fullviewIndex !== -1) {
      const newFullviewIndex = normaliseIndex(fullviewIndex - 1);
      setFullviewIndex(newFullviewIndex);
    }

    const newIndex = normaliseIndex(currentIndex - 1);
    setCurrentIndex(newIndex);
  };

  const handleNextClick = () => {
    if (fullviewIndex !== -1) {
      const newFullviewIndex = normaliseIndex(fullviewIndex + 1);
      setFullviewIndex(newFullviewIndex);
    }

    const newIndex = normaliseIndex(currentIndex + 1);
    setCurrentIndex(newIndex);
  };

  const handleLeftItemClick = () => {
    const newIndex = fullviewIndex === -1 ? currentIndex : fullviewIndex;
    setFullviewIndex(normaliseIndex(newIndex - 1));
  };

  const handleMainItemClick = () => {
    setFullviewIndex(currentIndex);
  };

  const handleRightItemClick = () => {
    const newIndex = fullviewIndex === -1 ? currentIndex : fullviewIndex;
    setFullviewIndex(normaliseIndex(newIndex + 1));
  };

  const handleCloseFullview = () => {
    setFullviewIndex(-1);
  };

  useEffect(() => {
    async function fetchGame() {
      const { name } = await params;
      const game = await getCurrentGame(name, user?.playerName || '', user?.code || '');
      if (!game) {
        router.replace("/not-found");
        return;
      }

      if (game.status !== GameStatus.Completed) {
        router.replace(`/game/${game.name}`);
        return;
      }

      const items = await getGameCanvasShowcase(game.id, user?.playerName || '', user?.code || '');
      let selected: Array<GameCanvasShowcaseDetails> = [];

      if (items?.length > 0) {
        selected = chooseShowcaseItems(items);
        setCurrentIndex(0);
      }

      setGame(game);
      setShowcase(selected);
      setPending(false);
    }

    fetchGame();
  }, [router, params, user]);

  const leftIndex = currentIndex !== -1 && showcase.length > 1 ? (currentIndex - 1 + showcase.length) % showcase.length : -1;
  const rightIndex = currentIndex !== -1 && showcase.length > 1 ? (currentIndex + 1) % showcase.length : -1;

  return (
    <div className="flex flex-col align-self-start items-center mt-24 gap-4">
      {pending &&
        <div className="flex h-full">
          <Loading className="-mt-16 self-center scale-150" />
        </div>
      }
      {game && !pending && <>
        {fullviewIndex !== -1 &&
          <div className="relative items-center justify-center -mb-4">
            <div
              onClick={handleCloseFullview}
              className={cn("absolute", "flex",
                "items-center", "justify-center",
                "place-self-center", "-top-4",
                "bg-[var(--background)]",
                "z-100", "cursor-pointer",
                "rounded-xl", "mx-2",
                "w-170", "h-170"
              )}
            >
              <Fullview className="absolute top-0 left-0" item={showcase[fullviewIndex]} />
            </div>
          </div>
        }
        <h2 className="flex flex-row items-center font-subheading gap-2">
          <PortraitIcon alt="Gallery" className="-mt-2 scale-120" />
          Gallery
        </h2>
        <div className="flex gap-4">
          {showcase.length === 0 &&
            <span className="font-primary-lg text-center mt-8">No drawings to showcase.</span>
          }
          {showcase.length > 0 &&
            <div className="flex flex-row gap-4 items-center">
              {leftIndex !== -1 && <LeftButton className="border-0 p-4 hover:border-4 w-[75px]" onClick={handlePrevClick} />}
              {leftIndex !== -1 && <ShowcaseItem item={showcase[leftIndex]} onClick={handleLeftItemClick} className="mr-2" /> }
              {currentIndex !== -1 && <ShowcaseItem item={showcase[currentIndex]} onClick={handleMainItemClick} expand={true} /> }
              {rightIndex !== -1 && <ShowcaseItem item={showcase[rightIndex]} onClick={handleRightItemClick} className="ml-2" /> }
              {rightIndex !== -1 && <RightButton className="border-0 p-4 hover:border-4 w-[75px]" onClick={handleNextClick} />}
            </div>

          }
        </div>
        <Link href={`/summary/${game.name}`}>
          <TrophyButton className="w-50 mt-8">Summary</TrophyButton>
        </Link>
        <Link href={`/leaderboard/${game.name}`}>
          <PodiumButton imageAlt="Leaderboard" className="w-50">Leaderboard</PodiumButton>
        </Link>
        <LeaveGame game={game} className="mt-8" />
      </>}
    </div>
  );
}
