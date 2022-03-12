import React, { useRef, useState } from "react";

import { ScreenWrapper, Timer, Set, Spacer } from "../components";
import ExercisesModalButton from "../components/ExercisesModalButton";
import { SetType } from "../components/types";
import styled from "../styles";
import {
  Divider,
  EvenRow,
  Input,
  Subtitle,
  Text,
  Title,
} from "../styles/styles";
import { ScrollView } from "react-native-gesture-handler";
import { useIsKeyboardOpen } from "../contexts/AppStateContext";

export default function SetsScreen() {
  const [roundsInput, setRoundsInput] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [sets, setSets] = useState<SetType[]>([]);

  const [activeSet, setActiveSet] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  const listRef = useRef<ScrollView>(null);

  const isKeyboardOpen = useIsKeyboardOpen();

  const onSetEnd = () => {
    const nextSetIndex = (activeSet + 1) % sets.length;

    if (nextSetIndex === 0) {
      if (currentRound === 1) {
        // return true for stop clock
        return { stop: true };
      } else {
        // decrease rounds
        setActiveSet(nextSetIndex);
        setCurrentRound((x) => Math.max(x - 1, 0));
      }
    }
    // update active set only if it's not the last set of the last round
    setActiveSet(nextSetIndex);
    listRef.current?.scrollTo({ x: 0, y: activeSet, animated: true });

    return { endTime: sets[nextSetIndex].duration };
  };

  const removeSet = (set: SetType) => {
    setSets(sets.filter((x) => x !== set));
  };

  const onReset = () => {
    setActiveSet(0);
    setCurrentRound(roundsInput);
  };

  const setRounds = (input: string) => {
    const rounds = Number(input) || 0;
    setCurrentRound(rounds);
    setRoundsInput(rounds);
  };

  const currentSet = sets[activeSet];
  const nextSet = sets[(activeSet + 1) % sets.length];

  return (
    <ScreenWrapper noPadding>
      {!isKeyboardOpen && !isRunning && <Spacer fill />}

      {isRunning && (
        <Header>
          <Subtitle typography="subtitle">Round {currentRound}</Subtitle>
          <Title>{currentSet?.name}</Title>

          <Divider spacing="small" />

          <Subtitle typography="subtitle">Next round: {nextSet?.name}</Subtitle>
        </Header>
      )}

      {!isKeyboardOpen && (
        <TimerWrapper>
          <Timer
            name="sets"
            editable={false}
            showCentseconds
            rounds={currentRound}
            startTime={sets[activeSet]?.duration ?? 0}
            onTimeEnd={onSetEnd}
            onIsRunningChange={setIsRunning}
            onReset={onReset}
          />
        </TimerWrapper>
      )}

      <SetRow>
        <EvenRow>
          <Subtitle>Custom rounds</Subtitle>

          <BottomBarWrapper>
            <Text>Rounds</Text>

            <Spacer axis="x" />

            <Input
              value={roundsInput.toString()}
              onChangeText={setRounds}
              keyboardType="number-pad"
              alignRight
            />
          </BottomBarWrapper>
        </EvenRow>
      </SetRow>

      <SetsWrapper
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        ref={listRef}
      >
        {sets.length > 0 ? (
          sets.map((set, i) => (
            <Set
              key={set.name}
              isActive={isRunning && activeSet === i}
              onRemove={() => removeSet(set)}
              showTools={!isRunning}
              {...set}
            />
          ))
        ) : (
          <EmptySetsWrapper>
            <ExercisesModalButton onSelect={({ sets }) => setSets(sets)}>
              <Subtitle>Tap to add sets</Subtitle>
            </ExercisesModalButton>
          </EmptySetsWrapper>
        )}
      </SetsWrapper>
    </ScreenWrapper>
  );
}

const Header = styled.View`
  align-items: center;
  padding-vertical: ${(p) => p.theme.spacing.default};
`;

const EmptySetsWrapper = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TimerWrapper = styled.View`
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
`;

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

const BottomBarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
