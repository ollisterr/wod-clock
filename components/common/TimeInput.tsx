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
      keyboardType="number-pad"
    />
  );
}

const Input = styled.TextInput<{ color?: Color }>`
  ${(p) => p.theme.typography.timer}
  flex: 1 1 ${(p) => p.theme.px(60)};
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
`;
