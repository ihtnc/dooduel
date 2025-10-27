"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ArrowLeftButton from "@/components/button/arrowLeftButton";
import InstructionsIcon from "@/components/icons/instructionsIcon";
import StopwatchIcon from "@/components/icons/stopwatchIcon";
import { ReactNode } from "react";
import TargetIcon from "@/components/icons/targetIcon";
import { cn } from "@utilities/index";

export default function HowToPlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prev = searchParams.get('prev') || "/";

  const navigateBack = () => {
    router.push(prev);
  };

  return (
    <div className="flex flex-col items-center justify-center w-162 gap-4 mt-20 text-[var(--secondary)]">
      <h2 className="mb-4 font-subheading flex items-center gap-2">
        <InstructionsIcon alt="How to play" className="inline-block scale-120" />
        How to play
      </h2>
      <p className="font-primary-xl">Doodle fast. Guess faster.</p>
      <p className="text-center">
        Players take turns <Highlight>drawing</Highlight> a secret word while the rest try to <Highlight>guess</Highlight> what it is.
        <br />
        Each turn takes only about a minute, so be quick with your doodles and guesses!
        <br />
        At the end of each turn, scores are awarded to players based on how well they did.
        <br />
        The player with the <Highlight>highest score</Highlight> at the end of the game wins!
      </p>
      <p className="flex items-center mt-2">
        <StopwatchIcon alt="Stopwatch" className="inline-block scale-110" />
        60 seconds per turn. 30 seconds in between turns.
      </p>
      <p className="text-xl font-bold gap-1 flex items-center">
        <TargetIcon alt="Objectives" className="inline-block" />
        For <Highlight className="font-primary-lg">doodlers</Highlight>:
      </p>
      <ul className="leading-7 -mt-4 mb-4 list-disc list-inside">
        <li>Draw as quick as you can</li>
        <li>Get as many players as possible to correctly guess the word</li>
        <li>Erasures are not allowed</li>
        <li>
          Scoring criteria:&nbsp;
          <Highlight>speed</Highlight>,&nbsp;
          <Highlight>accuracy</Highlight>,&nbsp;
          <Highlight>efficiency</Highlight>,&nbsp;
          and&nbsp;<Highlight>reactions</Highlight>&nbsp;received
        </li>
      </ul>
      <p className="text-xl font-bold gap-1 flex items-center">
        <TargetIcon alt="Objectives" className="inline-block" />
        For <Highlight className="font-primary-lg">guessers</Highlight>:
      </p>
      <ul className="leading-7 -mt-4 mb-4 list-disc list-inside">
        <li>Guess the word as quickly as you can</li>
        <li>Make as few guesses as possible</li>
        <li>
          Scoring criteria:&nbsp;
          <Highlight>speed</Highlight>,&nbsp;
          <Highlight>accuracy</Highlight>,&nbsp;
          <Highlight>efficiency</Highlight>,&nbsp;
          and&nbsp;<Highlight>reaction</Highlight>&nbsp;given
        </li>
      </ul>
      {searchParams.has("prev") &&
        <ArrowLeftButton className="w-50 mt-8" onClick={navigateBack} imageAlt="Go back">
          Back
        </ArrowLeftButton>
      }
    </div>
  );
};

const Highlight = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("font-bold", "font-primary", "text-[var(--primary)]",
      "mx-1",
      className?.split(" ") || [])}
    >
      {children}
    </span>
  );
};