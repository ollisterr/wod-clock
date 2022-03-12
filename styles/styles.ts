import styled, { css } from ".";
import theme, { Color, Spacing, Typography } from "./theme";

export const RoundButton = styled.TouchableOpacity`
  background-color: ${(p) => p.theme.colors.peach};
  border-radius: ${(p) => p.theme.borderRadius.pill};
`;

export const OutlineButton = styled.TouchableOpacity`
  padding-vertical: ${(p) => p.theme.spacing.small};
  padding-horizontal: ${(p) => p.theme.spacing.large};
  border-radius: ${(p) => p.theme.borderRadius.pill};
  border: solid 2px ${(p) => p.theme.colors.white};
  color: ${(p) => p.theme.colors.white};
  align-items: center;
  justify-content: center;
`;

export const EmptyList = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.default};
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

export const Title = styled(Text).attrs({ typography: "title" })``;
export const Subtitle = styled(Text).attrs((props) => ({
  typography: "subtitle",
  color: "lightgrey",
  ...props,
}))``;

export const Input = styled.TextInput.attrs({
  placeholderTextColor: theme.colors.grey,
})<{ fill?: boolean; alignRight?: boolean }>`
  ${(p) => p.theme.typography.description}
  border-radius: ${(p) => p.theme.borderRadius.default};
  padding: ${(p) => p.theme.spacing.small} ${(p) => p.theme.spacing.default};
  flex: ${(p) => (p.fill ? 1 : 0)} 1 20%;
  width: 20%;
  color: ${(p) => p.theme.colors.white};
  background-color: rgba(0, 0, 0, 0.2);
  ${(p) => p.alignRight && "text-align: right;"}
`;

export const Divider = styled.View<{ spacing?: Spacing }>`
  width: ${(p) => p.theme.spacing.medium};
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
  margin-vertical: ${(p) => p.theme.spacing[p.spacing ?? "default"]};
  border-radius: ${(p) => p.theme.borderRadius.pill};
`;
