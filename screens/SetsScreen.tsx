import React, { useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

import {
  ScreenWrapper,
  Timer,
  Set,
  SpacedRow,
  Spacer,
  IconButton,
} from "../components";
import ExercisesModalButton from "../components/ExercisesModalButton";
import { SetType } from "../components/types";
import { SECOND } from "../constants/time";
import styled from "../styles";
import { EvenRow, Input, Text } from "../styles/styles";
import theme from "../styles/theme";
import { openExercise } from "../utils/set.utils";

export default function SetsScreen() {
  const [rounds, setRounds] = useState(1);
  const [sets, setSets] = useState<SetType[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(60);
  const [activeSet, setActiveSet] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<Timer>();

  const onSetEnd = () => {
    const nextSetIndex = (activeSet + 1) % sets.length;
    setActiveSet(nextSetIndex);

    if (nextSetIndex === 0) {
      setRounds((x) => Math.max(x - 1, 0));
    } else {
      timerRef.current?.setTime(sets[nextSetIndex].duration);
    }
  };

  const addSet = () => {
    setSets((x) => [...x, { name, duration: duration * SECOND }]);
    setDuration(60);
    setName("");
  };

  const removeSet = (set: SetType) => {
    setSets(sets.filter((x) => x !== set));
  };

  const clearSets = () => setSets([]);

  const onReset = () => {
    setActiveSet(0);
    setRounds(1);
  };

  return (
    <ScreenWrapper noPadding>
      <Spacer fill />

      <TimerWrapper>
        <Timer
          ref={timerRef}
          editable={false}
          showCentseconds
          rounds={rounds}
          startTime={sets[activeSet]?.duration ?? 0}
          onTimeEnd={onSetEnd}
          onStart={() => setIsRunning(true)}
          onPause={() => setIsRunning(false)}
          onReset={onReset}
        />
      </TimerWrapper>

      <SetsWrapper keyboardShouldPersistTaps="handled">
        {sets.map((set, i) => (
          <Set
            key={set.name}
            isActive={isRunning && activeSet === i}
            onRemove={() => removeSet(set)}
            {...set}
          />
        ))}

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
              onChangeText={(x) => Number(x) && setDuration(Number(x))}
              keyboardType="number-pad"
              alignRight
            />

            <Text>sec</Text>

            <IconButton onPress={addSet} size="large" disabled={!name}>
              <AddIcon name="plus" color={theme.colors.white} />
            </IconButton>
          </SpacedRow>
        </SetRow>
      </SetsWrapper>

      <BottomBar>
        <BottomBarWrapper>
          <ExercisesModalButton onSelect={({ sets }) => setSets(sets)}>
            <AddIcon name="close" color={theme.colors.white} />
          </ExercisesModalButton>

          <Spacer axis="x" />

          <IconButton onPress={addSet} size="large" disabled={!sets.length}>
            <AddIcon name="save" color={theme.colors.white} />
          </IconButton>

          <Spacer axis="x" />

          <IconButton onPress={clearSets} size="large" disabled={!sets.length}>
            <AddIcon name="trash" color={theme.colors.white} />
          </IconButton>
        </BottomBarWrapper>

        <BottomBarWrapper>
          <Text>Rounds</Text>

          <Spacer axis="x" />

          <Input
            value={rounds.toString()}
            onChangeText={(x) => Number(x) && setRounds(Number(x))}
            keyboardType="number-pad"
            alignRight
            fill
          />
        </BottomBarWrapper>
      </BottomBar>
    </ScreenWrapper>
  );
}

const TimerWrapper = styled.View`
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
`;

const SetRow = styled.View`
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
`;

const AddIcon = styled(FontAwesome)``;

const SetsWrapper = styled.ScrollView`
  flex: 2;
  width: 100%;
  padding-top: ${(p) => p.theme.spacing.default};
`;

const BottomBar = styled(EvenRow)`
  width: 100%;
  padding: ${(p) => p.theme.spacing.xsmall} ${(p) => p.theme.spacing.default};
  justify-content: flex-end;
  border-top-width: 1px;
  border-top-color: ${(p) => p.theme.colors.grey};
`;

const BottomBarWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;
