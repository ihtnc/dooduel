"use client";

import { useActionState, useEffect } from "react";
import TextBox from "@/components/textBox";
import LightbulbButton from "@/components/button/lightbulbButton";
import { getUserContext } from "@/components/userContextProvider";
import { submitAnswer } from "./actions";

export default function SubmitAnswer({
  roundId,
  onSubmit
}: {
  roundId?: number,
  onSubmit?: (result: number) => void
}) {
  const user = getUserContext();

  const [state, action, pending] = useActionState(submitAnswer, undefined);

  useEffect(() => {
    if (!pending && state) {
      onSubmit?.(Number(state.result));
    }
  }, [pending, state, onSubmit]);

  return <>
    <form action={action} className={"flex gap-2 items-center"}>
      <input type="hidden" name="round_id" value={roundId || ""} />
      <input type="hidden" name="player_name" value={user?.playerName} />
      <input type="hidden" name="player_code" value={user?.code} />
      <TextBox type="text" name="answer" placeholder="Enter guess..." required className="flex w-75" />
      <LightbulbButton type="submit" imageAlt="Submit answer" className="w-50" disabled={pending || !user}>
        {pending ? "Submitting..." : "Submit"}
      </LightbulbButton>
      {state?.error && <div className="text-red-600">{state.error}</div>}
    </form>
  </>;
};