import React, { useEffect } from "react";
import { Modal } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SECOND } from "../constants/time";

import useTimer from "../hooks/useTimer";
import styled from "../styles";
import { timeBreakdown } from "../utils/time.utils";

interface Props {
  running: boolean;
  length: number;
  onFinish?: () => void;
  onCancel?: () => void;
}

export default function Countdown({
  running,
  onCancel,
  length,
  onFinish,
}: Props) {
  const { start, time, stop } = useTimer({
    name: "countdown",
    startValue: length * SECOND,
    intervalLength: 100,
    countdown: true,
    onTimeEnd: onFinish,
  });

  const cancel = () => {
    onCancel?.();
    stop();
  };

  const scale = useSharedValue(100);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value / 100 }],
  }));

  const { seconds } = timeBreakdown(time);

  useEffect(() => {
    scale.value = 150;
    scale.value = withTiming(100, {
      duration: 200,
      easing: Easing.out(Easing.linear),
    });
  }, [seconds]);

  useEffect(() => {
    if (running) {
      start();
    } else {
      stop();
    }
  }, [running]);

  return (
    <Modal
      visible={running}
      transparent
      // make unpressable when hidden
      pointerEvents={running ? "auto" : "none"}
    >
      <Backdrop onPress={cancel} activeOpacity={1}>
        {/* increment by 1 to not show zero value */}
        <CountdownText style={animatedStyles}>{seconds + 1}</CountdownText>
      </Backdrop>
    </Modal>
  );
}

const CountdownText = styled(Animated.Text)`
  ${(p) => p.theme.typography.timer}
  font-size: ${(p) => p.theme.px(120)};
  color: ${(p) => p.theme.colors.white};
`;

const Backdrop = styled.TouchableOpacity`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`;
