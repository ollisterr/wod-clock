import { FontAwesome } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { TouchableNativeFeedbackProps } from "react-native";

import styled from "../../styles";
import theme, { Spacing } from "../../styles/theme";

interface Props extends TouchableNativeFeedbackProps {
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
}
export default function Button({ children, ...rest }: Props) {
  return (
    <ButtonWrapper {...rest}>
      <ButtonText>{children}</ButtonText>
    </ButtonWrapper>
  );
}

const ButtonWrapper = styled.TouchableOpacity`
  flex: 0;
  min-height: ${(p) => p.theme.px(20)};
  min-width: ${(p) => p.theme.px(20)};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-vertical: ${(p) => p.theme.spacing.small};
  padding-horizontal: ${(p) => p.theme.spacing.small};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.pill};
  background-color: ${(p) => p.theme.colors.peachMuted};
`;

const ButtonText = styled.Text`
  text-align: center;
  color: ${(p) => p.theme.colors.white};
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

interface IconButtonProps extends Props {
  size?: Spacing;
}

export function IconButton({
  children,
  size = "xxlarge",
  ...rest
}: IconButtonProps) {
  return (
    <IconButtonWrapper {...rest} size={size}>
      <IconWrapper>{children}</IconWrapper>
    </IconButtonWrapper>
  );
}

const IconButtonWrapper = styled.TouchableOpacity<{
  size: Spacing;
}>`
  width: ${(p) => p.theme.spacing[p.size]};
  height: ${(p) => p.theme.spacing[p.size]};
  border-radius: 999px;
  overflow: hidden;
  border: solid 3px rgba(255, 255, 255, 0.3);
  align-items: center;
  justify-content: center;
  ${(p) => p.disabled && "opacity: 0.2;"}
`;

const IconWrapper = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

export const AddButton = ({ size = "large", ...props }: IconButtonProps) => (
  <IconButton {...props} size={size}>
    <FontAwesome name="plus" color={theme.colors.white} />
  </IconButton>
);
