"use client";

import { useActionState, useEffect, useState } from "react";
import { getUserContext } from "@/components/userContextProvider";
import TextBox from "@/components/textBox";
import TextOverlay from "@/components/textOverlay";
import LightbulbButton from "@/components/button/lightbulbButton";
import { submitAnswer } from "./actions";
import { cn } from "@utilities/index";

export default function SubmitAnswer({
  roundId,
  onSubmit
}: {
  roundId?: number,
  onSubmit?: (result: number) => void
}) {
  const user = getUserContext();

  const [state, action, pending] = useActionState(submitAnswer, undefined);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (!pending && state) {
      if (state.error) {
        return;
      }

      onSubmit?.(Number(state.result));
    }
  }, [pending, state, onSubmit]);

  const handleTextHidden = () => {
    if (state) { state.error = ""; }
  };

  return <>
    <form action={action} className={"flex gap-2 items-center"}>
      <input type="hidden" name="round_id" value={roundId || ""} />
      <input type="hidden" name="player_name" value={user?.playerName} />
      <input type="hidden" name="player_code" value={user?.code} />
      <TextBox autoFocus type="text" name="answer" placeholder="Enter guess..." className="flex w-75" value={answer} onChange={e => setAnswer(e.target.value)} />
      <TextOverlay
        className="min-w-50 w-fit h-[50px] -mt-2"
        text={state?.error}
        textClassName={cn("font-error", "truncate", "mt-1", "left-0", "translate-x-0")}
        showText={state?.error ? true : false}
        onTextHidden={handleTextHidden}
      >
        <LightbulbButton type="submit" imageAlt="Submit answer" className="w-50" disabled={pending || !user}>
          {pending ? "Submitting..." : "Submit"}
        </LightbulbButton>
      </TextOverlay>
    </form>
  </>;
};