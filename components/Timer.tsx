import React from "react";
import styled from "../styles";

import { CENTSECOND, HOUR, MINUTE, SECOND } from "../constants/time";
import { leadingZeros } from "../utils/time.utils";
import { TimerText } from "../styles/styles";

interface Props {
  time: number;
  showCentseconds?: boolean;
  showHours?: boolean;
}

export default function Timer({
  time,
  showCentseconds = true,
  showHours = false,
}: Props) {
  const hours = leadingZeros(Math.floor(time / HOUR));
  const minutes = leadingZeros(Math.floor(time / MINUTE) % 60);
  const seconds = leadingZeros(Math.floor(time / SECOND) % 60);
  const centSeconds = leadingZeros(Math.floor(time / CENTSECOND) % 100);

  return (
    <Wrapper>
      {showHours && (
        <>
          <TimerText>{hours}</TimerText>
          <TimerText>:</TimerText>
        </>
      )}
      <TimerText>{minutes}</TimerText>
      <TimerText>:</TimerText>
      <TimerText>{seconds}</TimerText>
      {showCentseconds && (
        <>
          <TimerText>:</TimerText>
          <TimerText>{centSeconds}</TimerText>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex-direction: row;
`;
