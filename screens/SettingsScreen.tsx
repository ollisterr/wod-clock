import React from "react";
import { ScrollView, View } from "react-native";
import { Button, ScreenWrapper, Spacer } from "../components";
import { Row } from "../components/ExercisesModal/common";
import SettingRow from "../components/SettingRow";
import { useSettings } from "../contexts/SettingsContext";

import styled from "../styles";
import { EvenRow, Input, Text } from "../styles/styles";

export default function SettingsScreen() {
  const {
    countdownEnabled,
    toggleCountdownEnabled,
    audioEnabled,
    toggleAudioEnabled,
    vibrationEnabled,
    toggleVibrationEnabled,
    countdownLength,
    setCountdownLength,
    cueLength,
    setCueLength,
  } = useSettings();

  const isCueEnabled = audioEnabled || vibrationEnabled;

  return (
    <ScreenWrapper>
      <HeaderWrapper>
        <Text>Settings</Text>
      </HeaderWrapper>

      <ScrollView style={{ width: "100%", flexGrow: 1 }}>
        <Group>
          <SettingRow
            title="Countdown before start"
            value={countdownEnabled}
            onToggle={toggleCountdownEnabled}
          />

          <InputRow disabled={!countdownEnabled}>
            <Text>Countdown length</Text>

            <Input
              value={countdownLength.toString()}
              onChangeText={(x: string) =>
                countdownEnabled && setCountdownLength(Number(x))
              }
              alignRight
            />
          </InputRow>
        </Group>

        <Group>
          <SettingRow
            title="Audio enabled"
            value={audioEnabled}
            onToggle={toggleAudioEnabled}
          />

          <SettingRow
            title="Vibration enabled"
            value={vibrationEnabled}
            onToggle={toggleVibrationEnabled}
          />

          <InputRow disabled={!isCueEnabled}>
            <Text>Cue on last</Text>

            <InputWrapper>
              <Input
                value={cueLength.toString()}
                onChangeText={(x: string) =>
                  isCueEnabled && setCueLength(Number(x))
                }
                alignRight
              />

              <Spacer axis="x" />

              <Text>sec</Text>
            </InputWrapper>
          </InputRow>
        </Group>
      </ScrollView>
    </ScreenWrapper>
  );
}

const HeaderWrapper = styled.View`
  flex: 2;
`;

const InputRow = styled(EvenRow)<{ disabled?: boolean }>`
  ${(p) => p.disabled && "opacity: 0.3;"}
  padding-vertical: ${(p) => p.theme.spacing.small};
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Group = styled.View`
  padding-vertical: ${(p) => p.theme.spacing.small};
`;
