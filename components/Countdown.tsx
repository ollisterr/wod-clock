import React, { useEffect } from "react";
import { View } from "react-native";
import { SECOND } from "../constants/time";

import useTime from "../hooks/useTime";
import { Text } from "../styles/styles";

interface Props {
  length: number;
  onFinish?: () => void;
}

export default function Countdown({ length, onFinish }: Props) {
  const { start, time, reset } = useTime({
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
