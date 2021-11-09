import * as React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { Button, TimerInput } from "../components/common";
import Timer from "../components/Timer";
import { HOUR, MINUTE, SECOND } from "../constants/time";
import useTime from "../hooks/useTime";
import styled from "../styles";
import { TimerText, ScreenWrapper, EvenRow } from "../styles/styles";
import { timeBreakdown } from "../utils/time.utils";
import theme from "../styles/theme";
import { IconButton } from "../components/common/Button";

export default function TimerScreen() {
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  const timeInMs = hours * HOUR + minutes * MINUTE + seconds * SECOND;

  const { time, start, pause, reset, isRunning } = useTime({
    startValue: timeInMs,
    countDown: true,
    onPause: (currentTime) => {
      const components = timeBreakdown(currentTime);
      setHours(components.hours);
      setMinutes(components.minutes);
      setSeconds(components.seconds);
    },
  });

  return (
    <ScreenWrapper>
      <TimerWrapper>
        {isRunning ? (
          <Timer
            time={time}
            showHours={hours > 0}
            showCentseconds={hours === 0}
          />
        ) : (
          <>
            <TimerInput value={hours} onChange={setHours} />
            <TimerText>:</TimerText>
            <TimerInput value={minutes} onChange={setMinutes} />
            <TimerText>:</TimerText>
            <TimerInput value={seconds} onChange={setSeconds} />
          </>
        )}
      </TimerWrapper>

      <EvenRow>
        <IconButton onPress={start}>
          <FontAwesome name="play" size={30} color={theme.colors.white} />
        </IconButton>

        <IconButton onPress={pause}>
          <FontAwesome name="pause" size={30} color={theme.colors.white} />
        </IconButton>

        <IconButton onPress={reset}>
          <FontAwesome name="repeat" size={30} color={theme.colors.white} />
        </IconButton>
      </EvenRow>
    </ScreenWrapper>
  );
}

const TimerWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  padding: ${(p) => p.theme.spacing.small};
`;
