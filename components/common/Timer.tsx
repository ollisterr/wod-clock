import { FontAwesome } from "@expo/vector-icons";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { Vibration } from "react-native";

import { IconButton, TimeInput } from ".";
import { CENTSECOND, HOUR, MINUTE, SECOND } from "../../constants/time";
import useTime from "../../hooks/useTime";
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
  intervalLength?: number;
  onReset?: () => void;
  onTimeEnd?: () => void | boolean;
  rounds?: number;
}

interface Timer {
  setTime: (time: number) => void;
}

const Timer = forwardRef(
  (
    {
      startTime = 0,
      countDown = true,
      showHours = false,
      showCentseconds = !showHours,
      editable = true,
      vibrate = true,
      onReset,
      ...props
    }: Props,
    ref
  ) => {
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);
    const [resetValue, setResetValue] = React.useState(startTime);

    const timeInMs = hours * HOUR + minutes * MINUTE + seconds * SECOND;

    const setTime = (time: number) => {
      const components = timeBreakdown(time);
      setHours(components.hours);
      setMinutes(components.minutes);
      setSeconds(components.seconds);
    };

    const { time, reset, start, pause, stop, isRunning } = useTime({
      startValue: timeInMs,
      resetValue,
      countDown,
      onStart: () => setResetValue(timeInMs),
      onPause: editable ? setTime : undefined,
      onReset: countDown ? () => setTime(resetValue) : undefined,
      ...props,
    });

    useEffect(() => {
      const time = timeBreakdown(startTime);
      setHours(time.hours);
      setMinutes(time.minutes);
      setSeconds(time.seconds);
    }, [startTime]);

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

    useImperativeHandle(ref, () => ({
      setTime: reset,
    }));

    const onResetPress = () => {
      onReset?.();
      stop();
    };

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
            <IconButton
              onPress={start}
              disabled={countDown && (timeInMs === 0 || time === 0)}
            >
              <FontAwesome name="play" size={20} color={theme.colors.white} />
            </IconButton>
          )}

          <IconButton onPress={onResetPress}>
            <FontAwesome name="repeat" size={20} color={theme.colors.white} />
          </IconButton>
        </EvenRow>
      </Wrapper>
    );
  }
);

export default Timer;

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
