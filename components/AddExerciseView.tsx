import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import { SECOND } from "../constants/time";

import styled from "../styles";
import { Input, Text } from "../styles/styles";
import theme from "../styles/theme";
import { Button, IconButton, SpacedRow } from "./common";
import { AddButton } from "./common/Button";
import Set from "./Set";
import { SetType } from "./types";

interface Props {
  sets: SetType[];
  onAddSet: (set: SetType) => void;
  onRemoveSet: (set: SetType) => void;
  onClose: () => void;
}

export default function AddExerciseView({
  sets,
  onAddSet,
  onRemoveSet,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(60);

  const onAddPress = () => {
    onAddSet({ name, duration: duration * SECOND });
    setDuration(60);
    setName("");
  };

  return (
    <>
      <SetsWrapper keyboardShouldPersistTaps="handled">
        {sets.map((set) => (
          <Set
            key={set.name}
            isActive={false}
            onRemove={() => onRemoveSet(set)}
            showTools
            {...set}
          />
        ))}
      </SetsWrapper>

      <SetRow>
        <SpacedRow>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="New set..."
            placeholderTextColor={theme.colors.grey}
            fill
          />

          <Input
            value={duration.toString()}
            onChangeText={(x) => setDuration(Number(x) || 0)}
            keyboardType="number-pad"
            alignRight
          />

          <Text>sec</Text>

          <AddButton onPress={onAddPress} size="large" disabled={!name} />
        </SpacedRow>
      </SetRow>

      <SetRow>
        <Button>Save exercise</Button>
      </SetRow>
    </>
  );
}

const SetRow = styled.View`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.default};
  padding-vertical: ${(p) => p.theme.spacing.xsmall};
`;

const SetsWrapper = styled.ScrollView`
  flex: 2;
  width: 100%;
  padding-top: ${(p) => p.theme.spacing.default};
`;
