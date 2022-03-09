import React, { useEffect } from "react";
import { View } from "react-native";
import { SECOND } from "../constants/time";

import useTimer from "../hooks/useTimer";
import { Text } from "../styles/styles";

interface Props {
  length: number;
  onFinish?: () => void;
}

export default function Countdown({ length, onFinish }: Props) {
  const { start, time, reset } = useTimer({
    startValue: length * SECOND,
    countDown: true,
    onTimeEnd: () => {
      onFinish?.();
      reset();
    },
  });

  useEffect(() => {
    start();
  }, []);

  return (
    <View>
      <Text>{time}</Text>
    </View>
  );
}
