import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Vibration } from "react-native";

import { IconButton, TimeInput } from ".";
import { CENTSECOND, HOUR, MINUTE, SECOND } from "../../constants/time";
import useTime, { Interval } from "../../hooks/useTime";
import styled from "../../styles";
import { EvenRow } from "../../styles/styles";
import theme, { Color } from "../../styles/theme";
import { timeBreakdown } from "../../utils/time.utils";

interface Props {
  startTime?: number;
  countDown?: boolean;
  showHours?: boolean;
  showCentseconds?: boolean;
  editable?: boolean;
  vibrate?: boolean;
  intervalLength?: Interval;
}

export default function Timer({
  startTime = 0,
  countDown = true,
  showHours = false,
  showCentseconds = !showHours,
  editable = true,
  vibrate = true,
  intervalLength,
}: Props) {
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);

  useEffect(() => {
    const time = timeBreakdown(startTime);
    setHours(time.hours);
    setMinutes(time.minutes);
    setSeconds(time.seconds);
  }, [startTime]);

  const timeInMs = hours * HOUR + minutes * MINUTE + seconds * SECOND;

  const { time, start, pause, reset, isRunning } = useTime({
    startValue: timeInMs,
    resetValue: 0,
    intervalLength,
    countDown,
    onPause: editable
      ? (currentTime) => {
          const components = timeBreakdown(currentTime);
          setHours(components.hours);
          setMinutes(components.minutes);
          setSeconds(components.seconds);
        }
      : undefined,
  });

  useEffect(() => {
    const components = timeBreakdown(time);
    if (
      vibrate &&
      isRunning &&
      countDown &&
      [0, 1, 2, 3, 4, 5].includes(components.seconds) &&
      components.minutes === 0 &&
      components.hours === 0
    ) {
      Vibration.vibrate();
    }
  }, [time, isRunning]);

  return (
    <Wrapper>
      <TimerWrapper>
        {showHours && (
          <>
            <TimeInput
              value={Math.floor(time / HOUR)}
              onChange={setHours}
              editable={editable}
            />
            <TimerText>:</TimerText>
          </>
        )}
        <TimeInput
          value={Math.floor(time / MINUTE) % 60}
          onChange={setMinutes}
          editable={editable}
        />
        <TimerText>:</TimerText>
        <TimeInput
          value={Math.floor(time / SECOND) % 60}
          onChange={setSeconds}
          editable={editable}
        />
        {showCentseconds && (
          <>
            <TimerText>:</TimerText>
            <TimeInput
              value={Math.floor(time / CENTSECOND) % 100}
              onChange={() => undefined}
              editable={false}
            />
          </>
        )}
      </TimerWrapper>

      <EvenRow>
        {isRunning ? (
          <IconButton onPress={pause}>
            <FontAwesome name="pause" size={20} color={theme.colors.white} />
          </IconButton>
        ) : (
          <IconButton onPress={start} disabled={countDown && timeInMs === 0}>
            <FontAwesome name="play" size={20} color={theme.colors.white} />
          </IconButton>
        )}

        <IconButton onPress={reset}>
          <FontAwesome name="repeat" size={20} color={theme.colors.white} />
        </IconButton>
      </EvenRow>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
`;

const TimerWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  padding: ${(p) => p.theme.spacing.medium} ${(p) => p.theme.spacing.small};
`;

const TimerText = styled.Text<{ color?: Color }>`
  ${(p) => p.theme.typography.timer}
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
`;
