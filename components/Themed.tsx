/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import useColorScheme from "../hooks/useColorScheme";
import theme, { Color } from "../styles/theme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: Color
) {
  const scheme = useColorScheme();
  const colorFromProps = props[scheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme.colors[colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
