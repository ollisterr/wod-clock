import * as styledComponents from "styled-components/native";

import { Theme } from "./theme";

const {
  default: styled,
  css,
  ThemeProvider,
  useTheme,
  // eslint-disable-next-line max-len
} = styledComponents as unknown as styledComponents.ReactNativeThemedStyledComponentsModule<Theme>;

export { css, ThemeProvider, useTheme };
export default styled;
