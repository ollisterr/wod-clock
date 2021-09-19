import { px } from "../utils/style.utils";

const theme = {
  colors: {
    // accents
    peach: "#ff6f3b",
    peachMuted: "#cc6039",
    peachGrey: "#d1b4ab",

    // greys
    black: "#333",
    grey: "#555",
    lightgrey: "#aaa",
    whitesmoke: "#ddd",
  },
  borderRadius: {
    small: px(3),
    default: px(5),
    large: px(10),
    pill: px(9999),
  },
  spacing: {
    none: 0,
    xxsmall: px(4),
    xsmall: px(8),
    small: px(12),
    default: px(16),
    medium: px(24),
    large: px(32),
    xlarge: px(48),
    xxlarge: px(64),
    xxxlarge: px(128),
  },
};

export type Theme = typeof theme;

export type Color = keyof Theme["colors"];

export type Spacing = keyof Theme["spacing"];

export default theme;
