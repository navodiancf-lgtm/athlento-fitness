import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT = "Inter Display";

loadFont({ family: FONT, url: staticFile("fonts/InterDisplay-Medium.otf"), weight: "500" });
loadFont({ family: FONT, url: staticFile("fonts/InterDisplay-Bold.otf"), weight: "700" });
loadFont({ family: FONT, url: staticFile("fonts/InterDisplay-ExtraBold.otf"), weight: "800" });

// Sampled from ovio.live
export const C = {
  blue: "#1D5BF5",
  blueSoft: "#EAF0FF",
  ink: "#111827",
  muted: "#6B7280",
  line: "#E5E7EB",
  bg: "#F6F8FC",
  white: "#FFFFFF",
  yes: "#16A34A",
  yesBg: "#E7F7EC",
  no: "#E5484D",
  noBg: "#FDECEC",
  olive: "#6B8E23",
};

export const FPS = 30;
// Scene start frames (120 BPM -> 1 beat = 15 frames). Total 900 = 30s.
export const SCENE_STARTS = [0, 120, 240, 390, 540, 690, 795];
export const TOTAL = 900;
export const TRANSITION = 12;
