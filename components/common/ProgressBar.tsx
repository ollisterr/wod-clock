import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import styled from "../../styles";

interface Props {
  duration: number;
  isActive: boolean;
  isRunning?: boolean;
}

export default function ProgressBar({
  duration,
  isActive,
  isRunning = false,
}: Props) {
  const currentProgress = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scaleX: currentProgress.value / 100 }],
  }));

  useEffect(() => {
    if (isActive) {
      if (isRunning) {
        currentProgress.value = withTiming(
          100,
          {
            // continue where the animation left of on pause
            duration: duration * (1 - currentProgress.value / 100),
            easing: Easing.linear,
          },
          (isFinished) => {
            // reset on finish
            if (isFinished) currentProgress.value = 0;
          }
        );
      } else {
        // pause animation to the current value
        currentProgress.value = currentProgress.value.valueOf();
      }
    } else {
      // clear animation on active change
      currentProgress.value = 0;
    }
  }, [isActive, isRunning]);

  return (
    <Wrapper>
      <Progress style={animatedStyles} />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  height: ${(p) => p.theme.spacing.xxsmall};
  background-color: ${(p) => p.theme.colors.grey};
  overflow: hidden;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  margin-left: -100%;
  background-color: ${(p) => p.theme.colors.whitesmoke};
`;
