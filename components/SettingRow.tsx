import React from "react";

import styled from "../styles";
import { Text } from "../styles/styles";
import ToggleButton from "./common/ToggleButton";

interface Props {
  title: string;
  value: boolean;
  onToggle: () => void;
}

export default function SettingRow({ title, value, onToggle }: Props) {
  return (
    <Wrapper>
      <Text>{title}</Text>
      <ToggleButton value={value} onChange={onToggle} />
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-vertical: ${(p) => p.theme.spacing.xsmall};
`;
