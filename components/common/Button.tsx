import { FontAwesome } from "@expo/vector-icons";
import React, { ReactNode, useEffect } from "react";
import { TouchableNativeFeedbackProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-vertical: ${(p) => p.theme.spacing.small};
  padding-horizontal: ${(p) => p.theme.spacing.small};
  border: none;
  border-radius: ${(p) => p.theme.borderRadius.pill};
  background-color: ${(p) => p.theme.colors.primaryMuted};
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
  success?: boolean;
}

export function IconButton({
  children,
  success = false,
  size = "xxlarge",
  ...rest
}: IconButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const opacity = useSharedValue(0);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(success ? 1 : 0, {
      duration: 300,
    });

    if (success) {
      scale.value = withSequence(
        withTiming(2, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [success]);

  return (
    <IconButtonWrapper {...rest} size={size}>
      <SuccessBackground style={opacityStyle} />

      <IconWrapper style={animatedStyle}>
        {success ? (
          <FontAwesome name="check" color={theme.colors.white} />
        ) : (
          children
        )}
      </IconWrapper>
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

const IconWrapper = styled(Animated.View)`
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const SuccessBackground = styled(IconWrapper)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.colors.success};
`;

export const AddButton = ({ size = "large", ...props }: IconButtonProps) => (
  <IconButton {...props} size={size}>
    <FontAwesome name="plus" color={theme.colors.white} />
  </IconButton>
);
