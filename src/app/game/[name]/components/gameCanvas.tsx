export default function GameCanvas() {
  return (<>
    <div className="relative flex items-center justify-center">
      <span className="absolute top-0 text-2xl">Doodle Canvas</span>
    </div>
    <div className="canvas-container flex flex-col items-center justify-center">
      <canvas id="doodleCanvas" className="border size-full"></canvas>
    </div>
  </>
  );
};
