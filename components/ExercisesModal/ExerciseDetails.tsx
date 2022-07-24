import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { SECOND } from "../../constants/time";

import styled from "../../styles";
import { Input, Text } from "../../styles/styles";
import theme from "../../styles/theme";
import { Button, SpacedRow, Spacer } from "../common";
import { AddButton, IconButton } from "../common/Button";
import Set from "../Set";
import { Exercise, SetType } from "../types";
import { BottomRow, HeaderRow } from "./common";

interface Props {
  exercise?: Exercise;
  onConfirm: (set: Exercise) => void;
  onSave: (set: Exercise) => Promise<boolean>;
  onClose: () => void;
}

export default function ExerciseDetails({
  exercise: origExercise,
  onConfirm,
  onSave,
  onClose,
}: Props) {
  const [exercise, setExercise] = useState<Exercise>({
    name: "",
    sets: [],
    timestamp: Date.now(),
    ...origExercise,
  });

  useEffect(() => {
    if (!origExercise) return;

    setExercise((prevState) => ({ ...prevState, ...origExercise }));
  }, [origExercise]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState(60);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const listRef = useRef<ScrollView>(null);

  const setField = <T extends keyof Exercise>(key: T, value: Exercise[T]) => {
    setSaveSuccess(false);
    setExercise((x) => ({ ...x, [key]: value }));
  };

  const addSet = (set: SetType) => setField("sets", [...exercise.sets, set]);

  const onRemoveSet = (set: SetType) =>
    setField(
      "sets",
      exercise.sets.filter((x) => x.name !== set.name)
    );

  const onAddPress = () => {
    addSet({ name, duration: duration * SECOND });
    setDuration(duration); // use the latest value as default
    setName("");
    listRef.current?.scrollToEnd({ animated: true });
  };

  const onSavePress = () => {
    onSave({ ...exercise, timestamp: Date.now() }).then(setSaveSuccess);
  };

  return (
    <>
      <HeaderRow>
        <SpacedRow>
          <IconButton size="large" onPress={onClose}>
            <FontAwesome name="chevron-left" color={theme.colors.white} />
          </IconButton>

          <Input
            value={exercise.name}
            onChangeText={(text) => setField("name", text)}
            placeholder="Untitle exercise"
            selectTextOnFocus
            fill
          />

          <IconButton size="large" onPress={onSavePress} success={saveSuccess}>
            <FontAwesome name="save" color={theme.colors.white} />
          </IconButton>
        </SpacedRow>
      </HeaderRow>

      <SetsWrapper
        keyboardShouldPersistTaps="handled"
        ref={listRef as any}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {exercise.sets.map((set, i) => (
          <Set
            key={`${set.name}-${i}`}
            isActive={false}
            onRemove={() => onRemoveSet(set)}
            compact
            showTools
            {...set}
          />
        ))}
      </SetsWrapper>

      <BottomRow>
        <SpacedRow spacing="small">
          <Input
            value={name}
            onChangeText={setName}
            placeholder="New set..."
            selectTextOnFocus
            fill
          />

          <>
            <Input
              value={duration.toString()}
              onChangeText={(x) => setDuration(Number(x) || 0)}
              keyboardType="number-pad"
              selectTextOnFocus
              alignRight
            />

            <Spacer axis="x" spacing="xsmall" />

            <Text typography="description">sec</Text>
          </>

          <AddButton onPress={onAddPress} size="large" disabled={!name} />
        </SpacedRow>

        <Spacer />

        <Button
          onPress={() => {
            onConfirm(exercise);
            onClose();
          }}
        >
          Start exercise
        </Button>
      </BottomRow>
    </>
  );
}

const SetsWrapper = styled.ScrollView`
  flex: 1;
  width: 100%;
`;
