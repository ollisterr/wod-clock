import * as React from "react";
import { View, Text } from "react-native";
import Button from "../components/common/Button";

import Timer from "../components/Timer";
import useTime from "../hooks/useTime";

export default function TabOneScreen() {
  const { time, start, pause } = useTime();

  return (
    <View>
      <Text>Stopwatch</Text>

      <Button onPress={start} text="start" />

      <Button onPress={pause} text="pause" />

      <Timer time={time} />
    </View>
  );
}
