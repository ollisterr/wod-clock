import React from "react";
import styled from "../styles";

import { CENTSECOND, MINUTE, SECOND } from "../constants/time";
import { leadingZeros } from "../utils/time.utils";
import { MonoText } from "./StyledText";

interface Props {
  time: number;
}

export default function Timer({ time }: Props) {
  const minutes = leadingZeros(Math.floor(time / MINUTE) % 60);
  const seconds = leadingZeros(Math.floor(time / SECOND) % 60);
  const centSeconds = leadingZeros(Math.floor(time / CENTSECOND) % 100);

  return (
    <Wrapper>
      <Text>{minutes}</Text>
      <Text>:</Text>
      <Text>{seconds}</Text>
      <Text>:</Text>
      <Text>{centSeconds}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex-direction: row;
`;

const Text = styled(MonoText)`
  font-size: 60px;
  color: ${(p) => p.theme.colors.peach};
`;
