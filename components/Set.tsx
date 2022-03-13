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
  isRunning?: boolean;
  isInActionView?: boolean;
  showTools?: boolean;
  compact?: boolean;
  onRemove?: () => void;
}

export default function Set({
  name,
  onRemove,
  showTools = false,
  isInActionView = false,
  compact = false,
  ...rest
}: Props) {
  return (
    <View>
      <Wrapper isActive={rest.isActive} isInActionView={isInActionView}>
        <SetTitle compact={compact} color={rest.isActive ? "peach" : undefined}>
          {name}
        </SetTitle>

        <SetText compact={compact}>{rest.duration / SECOND} s</SetText>

        {showTools && (
          <>
            <IconButton size="large" onPress={onRemove}>
              <FontAwesome name="trash" color={theme.colors.white} />
            </IconButton>

            <Spacer axis="x" />

            <IconButton size="large">
              <FontAwesome name="adjust" color={theme.colors.white} />
            </IconButton>
          </>
        )}
      </Wrapper>

      {isInActionView && <ProgressBar {...rest} />}
    </View>
  );
}

const Wrapper = styled.View<{ isActive?: boolean; isInActionView: boolean }>`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.default};
  padding-vertical: ${(p) => p.theme.spacing.small};
  flex-direction: row;
  align-items: center;
  background-color: ${(p) =>
    p.isActive ? "rgba(255, 255, 255, 0.05)" : "transparent"};
  ${(p) => p.isInActionView && !p.isActive && "opacity: 0.5;"}
  ${(p) => !p.isInActionView && "border-bottom-width: 1px;"}
  ${(p) =>
    !p.isInActionView && "border-bottom-color: rgba(150, 150, 150, 0.1);"}
`;

const SetText = styled(Text).attrs<{
  compact: boolean;
}>(({ compact, ...props }) => ({
  typography: compact ? "description" : "body",
  ...props,
}))<{
  compact: boolean;
}>`
  margin-right: ${(p) => p.theme.spacing.default};
`;

const SetTitle = styled(SetText)`
  flex: 1;
`;
