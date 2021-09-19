import * as React from "react";
import { Button, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import Timer from "../components/Timer";
import { SECOND } from "../constants/time";
import useTime from "../hooks/useTime";

export default function TabOneScreen() {
  const { time, start, reset, pause } = useTime({
    startValue: 10 * SECOND,
    countDown: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timer</Text>

      <Button title="start" onPress={start} />

      <Button title="pause" onPress={pause} />

      <Button title="reset" onPress={reset} />

      <Timer time={time} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
