import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Audio } from "expo-av";

import { Text } from "../styles/styles";
import { SECOND } from "../constants/time";
import { useSettings } from "../contexts/SettingsContext";
import useTimer from "../hooks/useTimer";
import styled from "../styles";
import { timeBreakdown } from "../utils/time.utils";
import Spacer from "./common/Spacer";
import { useSound } from "../contexts/SoundContext";

interface Props {
  running: boolean;
  onFinish?: () => void;
  onCancel?: () => void;
}

export default function Countdown({ running, onCancel, onFinish }: Props) {
  const { countdownLength } = useSettings();
  const { shortCue, longCue } = useSound();

  const { start, time, stop } = useTimer({
    name: "countdown",
    startValue: countdownLength * SECOND,
    intervalLength: 100,
    onTimeEnd: onFinish,
  });

  const scale = useSharedValue(100);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value / 100 }],
  }));

  const { seconds } = timeBreakdown(time);

  useEffect(() => {
    scale.value = 200;
    scale.value = withTiming(100, {
      duration: 200,
      easing: Easing.out(Easing.linear),
    });
  }, [seconds]);

  useEffect(() => {
    if (seconds > 4) return;

    shortCue();
  }, [seconds, shortCue, longCue]);

  useEffect(() => {
    running ? start() : stop();
  }, [running]);

  return (
    <Modal
      visible={running}
      transparent
      // make unpressable when hidden
      pointerEvents={running ? "auto" : "none"}
    >
      <Backdrop onPress={onCancel} activeOpacity={1}>
        {/* increment by 1 to not show zero value */}
        <CountdownText style={animatedStyles}>{seconds + 1}</CountdownText>

        <Spacer />

        <InfoText>Tap to cancel countdown</InfoText>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled.TouchableOpacity`
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const CountdownText = styled(Animated.Text)`
  ${(p) => p.theme.typography.timer}
  font-size: ${(p) => p.theme.px(120)};
  color: ${(p) => p.theme.colors.white};
`;

const InfoText = styled(Text)`
  font-size: ${(p) => p.theme.px(16)};
  color: ${(p) => p.theme.colors.grey};
`;
