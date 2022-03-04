import React from "react";
import { TextInputProps } from "react-native";
import { css } from "styled-components";
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
  editable?: boolean;
}
export default function TimerInput({
  value,
  onChange,
  color,
  digits = 2,
  min = 0,
  max = 59,
  placeholder,
  editable = true,
}: Props) {
  const onChangeText = (text: string) => {
    if (isNaN(Number(text))) return;
    onChange(
      Math.max(min ?? -Infinity, Math.min(max ?? Infinity, Number(text)))
    );
  };

  const formattedValue = leadingZeros(value, digits);
  return (
    <Wrapper>
      {editable ? (
        <Input
          value={formattedValue}
          onChangeText={onChangeText}
          color={color}
          placeholder={placeholder}
          selectTextOnFocus
          keyboardType="number-pad"
        />
      ) : (
        <TimerText color={color}>{formattedValue}</TimerText>
      )}
    </Wrapper>
  );
}
const Wrapper = styled.View`
  flex: 1 1 30%;
`;

const typographyStyle = css<{ color?: Color }>`
  ${(p) => p.theme.typography.timer}
  color: ${(p) => p.theme.colors[p.color ?? "peach"]};
  text-align: center;
`;

const Input = styled.TextInput`
  ${typographyStyle}
  flex: 1;
  max-width: 100%;
`;

const TimerText = styled.Text`
  ${typographyStyle}
`;
