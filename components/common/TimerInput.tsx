import React from "react";
import { TextInputProps } from "react-native";
import styled from "../../styles";
import { Color } from "../../styles/theme";
import { leadingZeros } from "../../utils/time.utils";

interface Props extends Omit<TextInputProps, "value" | "onChange"> {
  color?: Color;
  min?: number;
  max?: number;
  value: number;
  digits?: number;
  onChange: (value: number) => void;
}
export default function TimerInput({
  value,
  onChange,
  color,
  digits = 2,
  min = 0,
  max = 59,
  placeholder,
}: Props) {
  const onChangeText = (text: string) =>
    onChange(
      Math.max(min ?? -Infinity, Math.min(max ?? Infinity, Number(text)))
    );

  return (
    <Input
      value={leadingZeros(value, digits)}
      onChangeText={onChangeText}
      color={color}
      placeholder={placeholder}
      selectTextOnFocus
    />
  );
}

const Input = styled.TextInput<{ color?: Color }>`
  width: 240px;
  ${(p) => p.theme.typography.timer}
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
`;
