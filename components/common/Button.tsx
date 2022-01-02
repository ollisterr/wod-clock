import React, { ReactNode } from "react";
import { TouchableNativeFeedbackProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import styled from "../../styles";
import theme from "../../styles/theme";

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

export function IconButton({ children, ...rest }: Props) {
  return (
    <IconButtonWrapper {...rest}>
      <GradientWrapper colors={[theme.colors.grey, theme.colors.black]}>
        <IconWrapper>{children}</IconWrapper>
      </GradientWrapper>
    </IconButtonWrapper>
  );
}

const IconButtonWrapper = styled.TouchableOpacity`
  width: ${(p) => p.theme.px(70)};
  height: ${(p) => p.theme.px(70)};
  border-radius: 999px;
  overflow: hidden;
  border: solid 4px rgba(255, 255, 255, 0.1);
`;

const GradientWrapper = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: black;
`;

const IconWrapper = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
`;
