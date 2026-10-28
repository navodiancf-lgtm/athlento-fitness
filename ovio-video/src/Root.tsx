import { Composition } from "remotion";
import { FPS, TOTAL } from "./brand";
import { OvioPromo } from "./OvioPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="OvioPromo" component={OvioPromo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
  );
};
