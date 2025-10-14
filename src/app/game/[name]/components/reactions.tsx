"use client";

import { type ReactNode, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import AmusedIcon from "@/components/icons/amusedIcon";
import ConfusedIcon from "@/components/icons/confusedIcon";
import DisappointedIcon from "@/components/icons/disappointedIcon";
import HappyIcon from "@/components/icons/happyIcon";
import HeartIcon from "@/components/icons/heartIcon";
import LikeIcon from "@/components/icons/likeIcon";
import { cn } from "@utilities/index";
import StarIcon from "@/components/icons/starIcon";
import SurprisedIcon from "@/components/icons/surprisedIcon";

export default function Reactions({
  roundId
}: {
  roundId?: number
}) {
  const user = getUserContext();

  const [reaction, setReaction] = useState<string | null>(null);

  const handleReaction = async (reactionType: string) => {
    if (!user || !roundId) { return; }
    setReaction(reactionType);
  };

  const getIconClass = (reactionType: string, normalScale: number = 90, enlargedScale: number = 120) => cn(
    `scale-${normalScale}`,
    `group-hover:scale-${enlargedScale}`,
    reaction === reactionType ? `scale-${enlargedScale}` : ""
  );

  return <>
    <div className="flex flex-grow justify-center items-center -mt-1">
      <span className="font-bold pr-2">How was it?</span>
      <Reaction selected={reaction === "star"}>
        <StarIcon alt="Star"
          className={cn(getIconClass("star", 70, 100))}
          onClick={() => handleReaction("star")}
        />
      </Reaction>
      <Reaction selected={reaction === "love"}>
        <HeartIcon alt="Love"
          className={cn("-mt-1", "mb-1", getIconClass("love"))}
          onClick={() => handleReaction("love")}
        />
      </Reaction>
      <Reaction selected={reaction === "like"}>
        <LikeIcon alt="Like"
          className={cn(getIconClass("like", 70, 100))}
          onClick={() => handleReaction("like")}
        />
      </Reaction>
      <Reaction selected={reaction === "happy"}
        className="-ml-1">
        <HappyIcon alt="Happy"
          className={cn("ml-1", "mt-1", getIconClass("happy"))}
          onClick={() => handleReaction("happy")}
        />
      </Reaction>
      <Reaction selected={reaction === "amused"}>
        <AmusedIcon alt="Amused"
          className={cn("mt-1", getIconClass("amused"))}
          onClick={() => handleReaction("amused")}
        />
      </Reaction>
      <Reaction selected={reaction === "surprised"}>
        <SurprisedIcon alt="Surprised"
          className={cn(getIconClass("surprised"))}
          onClick={() => handleReaction("surprised")}
        />
      </Reaction>
      <Reaction selected={reaction === "confused"}
        className="-ml-1">
        <ConfusedIcon alt="Confused"
          className={cn("ml-1", "mt-1", getIconClass("confused"))}
          onClick={() => handleReaction("confused")}
        />
      </Reaction>
      <Reaction selected={reaction === "disappointed"}
        className="-ml-1">
        <DisappointedIcon alt="Disappointed"
          className={cn("ml-1", "mt-1", getIconClass("disappointed"))}
          onClick={() => handleReaction("disappointed")}
        />
      </Reaction>
    </div>
  </>;
};

const Reaction = ({
  children,
  selected = false,
  className = ""
}: {
  children: ReactNode,
  selected?: boolean,
  className?: string
}) => {
  return <div className={cn("cursor-pointer", "group",
    "border-4", "border-transparent", "rounded-full",
    selected
      ? ["border-[color:var(--primary)]", "hover:border-[color:var(--primary)]", "hover:bg-inherit", "hover:cursor-default"]
      : [""],
    className
  )}>
    {children}
  </div>;
};