import * as React from "react";
import { ScreenWrapper, Timer } from "../components/common";

export default function StopwatchScreen() {
  return (
    <ScreenWrapper>
      <Timer
        name="stopwatch"
        countdown={false}
        editable={false}
        showCentseconds
      />
    </ScreenWrapper>
  );
}
