import * as React from "react";
import { ScreenWrapper, Timer } from "../components/common";

export default function StopwatchScreen() {
  return (
    <ScreenWrapper>
      <Timer countDown={false} editable={false} showCentseconds />
    </ScreenWrapper>
  );
}
