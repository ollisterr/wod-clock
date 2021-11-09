import { LinearGradient } from "expo-linear-gradient";
import styled from ".";
import theme, { Color } from "./theme";

export const RoundButton = styled.TouchableHighlight`
  background-color: ${(p) => p.theme.colors.peach};
  border-radius: ${(p) => p.theme.borderRadius.pill};
`;

export const TimerText = styled.Text<{ color?: Color }>`
  ${(p) => p.theme.typography.timer}
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
`;

export const ScreenWrapper = styled(LinearGradient).attrs({
  colors: [theme.colors.grey, theme.colors.black],
})`
  width: 100%;
  flex: 1;
  padding: ${(p) => p.theme.spacing.default};
  background-color: black;
`;

export const EvenRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
