import { getPartSrc, parseCode } from "@/components/avatar";
import { GameCanvasShowcaseDetails } from "./types";
import Doodle from "@/components/doodle";
import { handleRenderBackground } from "./utilities";

export default function Fullview({
  item
}: {
  item: GameCanvasShowcaseDetails
}) {
  const avatar = parseCode(item.painterAvatar);
  const headSrc = getPartSrc("head", avatar?.head);
  const eyeSrc = getPartSrc("eye", avatar?.eye);
  const mouthSrc = getPartSrc("mouth", avatar?.mouth);

  const prepareText = (context: CanvasRenderingContext2D, item: GameCanvasShowcaseDetails, render: boolean): { width: number, height: number } => {
    context.save();

    const padding = 14;
    const gap = 8;
    let x = padding;
    let y = padding;

    context.font = "28px PrimaryFont";
    context.fillStyle = "rgb(113, 90, 90)"; //var(--primary)
    const titleText = `"${item.word}"`;
    const titleSize = context.measureText(titleText);
    const titleHeight = titleSize.actualBoundingBoxAscent;
    y += titleHeight;
    if (render) { context.fillText(titleText, x, y); }
    x += titleSize.width + gap;
    y = padding + (titleHeight / 2);

    context.font = "16px Geist";
    context.fillStyle = "rgb(55, 53, 62)"; //var(--foreground)
    const byText = "by";
    const bySize = context.measureText(byText);
    const byHeight = bySize.actualBoundingBoxAscent + bySize.actualBoundingBoxDescent;
    y += (byHeight / 2) - 2;
    if (render) { context.fillText(byText, x, y); }
    x += bySize.width + gap;
    y = padding + (titleHeight / 2);

    const imageSize = 32;
    x -= 2;
    y -= imageSize / 2;
    if (render && headLoaded && eyeLoaded && mouthLoaded) {
      context.drawImage(head, x, y, imageSize, imageSize);
      context.drawImage(eye, x, y, imageSize, imageSize);
      context.drawImage(mouth, x, y, imageSize, imageSize);
    }
    x += imageSize + gap - 2;
    y = padding + (titleHeight / 2);

    const painterText = item.painterName;
    const painterSize = context.measureText(painterText);
    const painterHeight = painterSize.actualBoundingBoxAscent + painterSize.actualBoundingBoxDescent;
    y += (painterHeight / 2) - 1;
    if (render) { context.fillText(painterText, x, y); }
    x += painterSize.width + padding;
    y = padding + Math.max(titleHeight, byHeight, imageSize, painterHeight) + 4;

    context.restore();

    return { width: x, height: y };
  }

  const handlerRenderForeground = (context: CanvasRenderingContext2D) => {
    const size = prepareText(context, item, false);

    context.save();
    context.fillStyle = "rgb(211, 218, 217)"; // var(--background)
    context.fillRect(0, 0, size.width, size.height);
    context.strokeStyle = "rgb(113, 90, 90)"; //var(--primary)
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(-4, -4, size.width, size.height, [0, 0, 8, 0]);
    context.stroke();
    context.restore();

    prepareText(context, item, true);

    context.save();
    context.strokeStyle = "rgb(113, 90, 90)"; //var(--primary)
    context.lineWidth = 4;
    context.beginPath();
    context.roundRect(2, 2, context.canvas.width - 8, context.canvas.height - 8, 8);
    context.stroke();
    context.restore();
  };

  let data = item.canvasData;
  let headLoaded = false;
  let eyeLoaded = false;
  let mouthLoaded = false;

  const head = new Image();
  head.src = headSrc;
  head.onload = () => {
    headLoaded = true;
    rerenderIfReady();
  };

  const eye = new Image();
  eye.src = eyeSrc;
  eye.onload = () => {
    eyeLoaded = true;
    rerenderIfReady();
  };

  const mouth = new Image();
  mouth.src = mouthSrc;
  mouth.onload = () => {
    mouthLoaded = true;
    rerenderIfReady();
  };

  const rerenderIfReady = () => {
    if (!headLoaded || !eyeLoaded || !mouthLoaded) { return; }
    data = [...item.canvasData];
  };

  return (
    <>
      <Doodle
        className="flex size-166"
        canvas={data}
        renderBackground={handleRenderBackground}
        renderForeground={handlerRenderForeground}
      />
    </>
  );
};
