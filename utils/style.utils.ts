import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/** Window width from design in pixels */
const designWidth = 375;

/** Scaled pixel regards to design */
const pixel = SCREEN_WIDTH / designWidth;

export const px = (value: number) => `${pxRaw(value)}px`;
export const pxRaw = (value: number) =>
  Math.round(PixelRatio.roundToNearestPixel(value * pixel));
