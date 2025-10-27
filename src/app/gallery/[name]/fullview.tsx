import Avatar from "@/components/avatar";
import { GameCanvasShowcaseDetails } from "./types";
import Doodle from "@/components/doodle";
import { cn } from "@utilities/index";

export default function Fullview({
  item,
  className
}: {
  item: GameCanvasShowcaseDetails,
  className?: string
}) {
  return (
    <div>
      <span className={cn("flex p-4 ml-2 items-center", className)}>
        <span className={cn("font-bold font-primary text-[var(--primary)]")}>
          &quot;{item.word}&quot;
        </span>
        <span className={cn("-mt-1 flex flex-row items-center")}>
          &nbsp;
          by
          &nbsp;
          <Avatar code={item.painterAvatar} className="size-8" containerClassName="size-8 my-1" />
          &nbsp;
          {item.painterName}
        </span>
      </span>
      <Doodle canvas={item.canvasData} className="flex size-166 border-4 border-[var(--primary)] rounded-lg" />
    </div>
  );
};
