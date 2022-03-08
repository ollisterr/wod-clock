import React from "react";
import { ScrollView } from "react-native";
import { ScreenWrapper } from "../components";
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
  } = useSettings();

  return (
    <ScreenWrapper>
      <HeaderWrapper>
        <Text>Settings</Text>
      </HeaderWrapper>

      <ScrollView style={{ width: "100%", flexShrink: 1 }}>
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
