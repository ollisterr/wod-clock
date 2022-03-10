import React, { useEffect } from "react";
import { View } from "react-native";
import { SECOND } from "../constants/time";

import useTimer from "../hooks/useTimer";
import { Text } from "../styles/styles";
import { timeBreakdown } from "../utils/time.utils";

interface Props {
  length: number;
  onFinish?: () => void;
}

export default function Countdown({ length, onFinish }: Props) {
  const { start, time, reset } = useTimer({
    name: "countdown",
    startValue: length * SECOND,
    intervalLength: 100,
    countdown: true,
    onTimeEnd: () => {
      onFinish?.();
      reset();
    },
  });

  useEffect(() => {
    start();
  }, []);

  const { seconds } = timeBreakdown(time);

  return (
    <View>
      {/* increment by 1 to not show zero value */}
      <Text typography="timer">{seconds + 1}</Text>
    </View>
  );
}
