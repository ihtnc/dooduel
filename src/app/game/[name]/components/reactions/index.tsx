"use client";

import { useEffect, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import Icon from "@/components/icons";
import Reaction, { getReactionAlt, getReactionClass, getReactionSrc } from "./reaction";
import { addGameReaction, getGameReaction } from "./actions";
import { cn } from "@utilities/index";
import { getReactionText } from "./utilities";

export default function Reactions({
  roundId,
  collapsible = false,
  className,
  collapsibleClassName,
  uncollapsibleClassName
}: {
  roundId?: number,
  collapsible?: boolean,
  className?: string,
  collapsibleClassName?: string,
  uncollapsibleClassName?: string
}) {
  const user = getUserContext();

  const [reaction, setReaction] = useState<string | null>(null);
  const [reactionText, setReactionText] = useState<string>("");
  const [collapsed, setCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const text = getReactionText();
    setReactionText(text);

    async function getReaction() {
      const reactionType = await getGameReaction(roundId!, user?.playerName || '', user?.code || '');
      setReaction(reactionType);
    };

    setReaction(null);
    getReaction();
  }, [roundId, user]);

  const handleReaction = async (reactionType: string) => {
    if (!user || !roundId) { return; }

    async function addReaction() {
      await addGameReaction(roundId!, user?.playerName || '', user?.code || '', reactionType);
    };

    addReaction();
    setReaction(reactionType);
    if (collapsible) { setCollapsed(true); }
  };

  return <>
    <div className={cn("flex", "items-center",
      collapsible ? "" : "h-[58px] justify-center",
      className?.split(" ") ?? [],
      (collapsible ? collapsibleClassName?.split(" ") : uncollapsibleClassName?.split(" ")) ?? []
    )}>
      {collapsible &&
        <span className={cn("flex", "rounded-xl", "border-4", "border-transparent", "group",
          "hover:border-4", "hover:border-[color:var(--secondary)]", "hover:bg-[color:var(--primary)]",
          collapsed ? "" : "border-[color:var(--primary)]"
        )}>
          <Icon
            src={getReactionSrc(reaction || "")}
            alt={getReactionAlt(reaction || "")}
            className={cn("cursor-pointer",
              "scale-80", "group-hover:scale-100",
              getReactionClass(reaction || ""),
              collapsed ? "" : "scale-100",
              reaction  === null ? "scale-90 group-hover:scale-110" : ""
            )}
            onClick={() => setCollapsed(!collapsed)}
          />
        </span>
      }
      {(!collapsible || !collapsed) && <>
        <div className="flex relative place-self-start">
          <div className={cn(
            "justify-center", "flex", "gap-2", "h-[58px]", "ml-2",
            "border-[var(--primary)]", "border-4", "rounded-xl",
            "bg-[var(--background)]",
            collapsible ? "absolute left-0 top-0 z-100 w-130" : "border-transparent items-center"
          )}>
            {!collapsible && <span className="font-bold pr-2">{reactionText}</span>}
            <Reaction
              reactionType="star"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "star"}
            />
            <Reaction
              reactionType="love"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "love"}
            />
            <Reaction
              reactionType="like"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "like"}
            />
            <Reaction
              reactionType="happy"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "happy"}
            />
            <Reaction
              reactionType="amused"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "amused"}
            />
            <Reaction
              reactionType="surprised"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "surprised"}
            />
            <Reaction
              reactionType="confused"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "confused"}
            />
            <Reaction
              reactionType="disappointed"
              collapsible={collapsible}
              onClick={handleReaction}
              selected={reaction === "disappointed"}
            />
        </div>
      </div>
    </>}
    </div>
  </>;
};