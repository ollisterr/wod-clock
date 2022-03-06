import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import styled from "../../styles";

interface Props {
  duration: number;
  isActive: boolean;
}

export default function ProgressBar({ duration, isActive }: Props) {
  const currentProgress = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: (currentProgress.value / 100) * 2 }],
    };
  });

  useEffect(() => {
    if (isActive) {
      currentProgress.value = withTiming(100, { duration });
    } else {
      currentProgress.value = 0;
    }
  }, [isActive]);

  return (
    <Wrapper>
      <Progress style={animatedStyles} />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex: 1;
  height: ${(p) => p.theme.spacing.small};
  border-radius: 999px;
  background-color: ${(p) => p.theme.colors.grey};
  overflow: hidden;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  background-color: ${(p) => p.theme.colors.white};
`;
