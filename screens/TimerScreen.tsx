import * as React from "react";

import { Timer, ScreenWrapper } from "../components/common";

export default function TimerScreen() {
  return (
    <ScreenWrapper>
      <Timer name="timer" showHours intervalLength={100} />
    </ScreenWrapper>
  );
}
