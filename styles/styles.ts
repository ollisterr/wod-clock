import styled, { css } from ".";
import { Color, Typography } from "./theme";

export const RoundButton = styled.TouchableOpacity`
  background-color: ${(p) => p.theme.colors.peach};
  border-radius: ${(p) => p.theme.borderRadius.pill};
`;

export const EvenRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Text = styled.Text<{
  typography?: Typography;
  color?: Color;
  bold?: boolean;
}>`
  ${(p) => p.theme.typography[p.typography ?? "body"]}
  color: ${(p) => p.theme.colors[p.color ?? "white"]};
  ${(p) =>
    p.bold &&
    css`
      font-weight: bold;
    `}
`;

export const Input = styled.TextInput<{ flex?: boolean }>`
  ${(p) => p.theme.typography.body}
  border-radius: ${(p) => p.theme.borderRadius.default};
  padding: ${(p) => p.theme.spacing.small} ${(p) => p.theme.spacing.default};
  flex: ${(p) => (p.flex ? 1 : 0)} 1 20%;
  width: 20%;
  color: ${(p) => p.theme.colors.white};
  background-color: rgba(0, 0, 0, 0.2);
`;
