import * as React from "react";

import { Timer, ScreenWrapper } from "../components/common";

export default function TimerScreen() {
  return (
    <ScreenWrapper>
      <Timer showHours intervalLength={480} />
    </ScreenWrapper>
  );
}
