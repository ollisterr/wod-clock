import { FontAwesome } from "@expo/vector-icons";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Vibration } from "react-native";

import TimeInput from "./TimeInput";
import { IconButton } from "./Button";
import { CENTSECOND, HOUR, MINUTE, SECOND } from "../../constants/time";
import { useSettings } from "../../contexts/SettingsContext";
import useTime from "../../hooks/useTime";
import styled from "../../styles";
import { EvenRow, Text } from "../../styles/styles";
import theme, { Color } from "../../styles/theme";
import {
  timeBreakdown,
  TimeComponents,
  timeComponentsToMilliseconds,
} from "../../utils/time.utils";
import Countdown from "../Countdown";
import { range } from "../../utils/utils";

interface Props {
  startTime?: number;
  countDown?: boolean;
  showHours?: boolean;
  showCentseconds?: boolean;
  editable?: boolean;
  intervalLength?: number;
  onStart?: () => void;
  onPause?: () => void;
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
      onReset,
      onPause,
      ...props
    }: Props,
    ref
  ) => {
    const {
      vibrationEnabled,
      audioEnabled,
      countdownEnabled,
      countdownLength,
    } = useSettings();

    const [shouldStart, setShouldStart] = useState(false);
    const [timeComponents, setTimeComponents] = useState<TimeComponents>({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    const [resetValue, setResetValue] = useState(startTime);

    const timeInMs = timeComponentsToMilliseconds(timeComponents);

    const setTime = (time: number) => setTimeComponents(timeBreakdown(time));

    const { time, reset, start, pause, stop, isRunning } = useTime({
      startValue: timeInMs,
      resetValue,
      countDown,
      onPause: (time) => {
        setTime(time);
        onPause?.();
      },
      onReset: countDown ? () => setTime(resetValue) : undefined,
      ...props,
    });

    useEffect(() => {
      setTime(startTime);
      setResetValue(startTime);
    }, [startTime]);

    useEffect(() => {
      const components = timeBreakdown(time);
      if (
        vibrationEnabled &&
        isRunning &&
        countDown &&
        range(5).includes(components.seconds) &&
        components.minutes === 0 &&
        components.hours === 0
      ) {
        Vibration.vibrate();
      }
    }, [timeBreakdown(time).seconds, isRunning, vibrationEnabled]);

    useImperativeHandle(ref, () => ({
      setTime: reset,
    }));

    const onResetPress = () => {
      onReset?.();
      reset();
    };

    const onStartPress = () =>
      countdownEnabled && time === resetValue ? setShouldStart(true) : start();

    if (shouldStart && countdownEnabled && time === resetValue) {
      return (
        <Countdown
          length={countdownLength}
          onFinish={() => {
            setShouldStart(false);
            start();
          }}
        />
      );
    }

    const setTimeComponent =
      (component: keyof TimeComponents) => (newValue: number) => {
        const newTime = { ...timeComponents, [component]: newValue };
        setTimeComponents(newTime);
        // set new reset value when inputs are manually changed
        setResetValue(timeComponentsToMilliseconds(newTime));
      };

    return (
      <Wrapper>
        <TimerWrapper>
          {showHours && (
            <>
              <TimeInput
                value={Math.floor(time / HOUR)}
                onChange={setTimeComponent("hours")}
                editable={editable}
              />
              <TimerText>:</TimerText>
            </>
          )}
          <TimeInput
            value={Math.floor(time / MINUTE) % 60}
            onChange={setTimeComponent("minutes")}
            editable={editable}
          />
          <TimerText>:</TimerText>
          <TimeInput
            value={Math.floor(time / SECOND) % 60}
            onChange={setTimeComponent("seconds")}
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

        {editable && <InfoText>Press to edit time</InfoText>}

        <EvenRow>
          <IconButton onPress={() => stop()} disabled={!isRunning}>
            <FontAwesome name="square" size={20} color={theme.colors.white} />
          </IconButton>

          <MiddleButtonWrapper>
            {isRunning ? (
              <IconButton onPress={pause}>
                <FontAwesome
                  name="pause"
                  size={20}
                  color={theme.colors.white}
                />
              </IconButton>
            ) : (
              <IconButton
                onPress={onStartPress}
                disabled={countDown && (timeInMs === 0 || time === 0)}
              >
                <FontAwesome name="play" size={20} color={theme.colors.white} />
              </IconButton>
            )}
          </MiddleButtonWrapper>

          <IconButton onPress={onResetPress} disabled={time === resetValue}>
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
  align-items: center;
`;

const TimerWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.xxsmall};
`;

const TimerText = styled.Text<{ color?: Color }>`
  ${(p) => p.theme.typography.timer}
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
`;

const MiddleButtonWrapper = styled.View`
  padding-top: ${(p) => p.theme.spacing.xlarge};
`;

const InfoText = styled(Text)`
  font-size: 12;
  text-align: center;
  padding-top: ${(p) => p.theme.spacing.xxsmall};
  padding-bottom: ${(p) => p.theme.spacing.medium};
  color: ${(p) => p.theme.colors.lightgrey};
`;
