import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { IconButton, Spacer, ProgressBar } from "./common";
import { SECOND } from "../constants/time";
import styled from "../styles";
import { Text } from "../styles/styles";
import theme from "../styles/theme";
import { SetType } from "./types";

interface Props extends Required<SetType> {
  isActive: boolean;
  onRemove: () => void;
}

export default function Set({ name, onRemove, ...rest }: Props) {
  return (
    <View>
      <Wrapper isActive={rest.isActive}>
        <SetTitle>{name}</SetTitle>

        <SetText>{rest.duration / SECOND} s</SetText>

        <IconButton size="large" onPress={onRemove}>
          <FontAwesome name="trash" color={theme.colors.white} />
        </IconButton>

        <Spacer axis="x" />

        <IconButton size="large">
          <FontAwesome name="adjust" color={theme.colors.white} />
        </IconButton>
      </Wrapper>

      <ProgressBar {...rest} />
    </View>
  );
}

const Wrapper = styled.View<{ isActive?: boolean }>`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.default};
  padding-vertical: ${(p) => p.theme.spacing.small};
  flex-direction: row;
  align-items: center;
  background-color: ${(p) =>
    p.isActive ? "rgba(255, 255, 255, 0.05)" : "transparent"};
`;

const SetText = styled(Text)`
  margin-right: ${(p) => p.theme.spacing.default};
`;

const SetTitle = styled(SetText)`
  flex: 1;
`;
