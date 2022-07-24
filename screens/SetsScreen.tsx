import React, { useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { ScreenWrapper, Timer, Set, Spacer } from "../components";
import ExercisesModalButton from "../components/ExercisesModal";
import { Exercise } from "../components/types";
import styled from "../styles";
import {
  Divider,
  EvenRow,
  Input,
  Subtitle,
  Text,
  Title,
} from "../styles/styles";
import theme from "../styles/theme";

export default function SetsScreen() {
  const [roundsInput, setRoundsInput] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [exercise, setExercise] = useState<Exercise>();

  const [activeSet, setActiveSet] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isInActionView, setIsInActionView] = useState(false);

  const listRef = useRef<ScrollView>(null);

  useEffect(() => {
    // reset active set on exercise change
    setActiveSet(0);
  }, [exercise]);

  const onSetEnd = () => {
    if (!exercise) return { stop: true };

    const nextSetIndex = (activeSet + 1) % exercise.sets.length;

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

    return { endTime: exercise.sets[nextSetIndex].duration };
  };

  const onReset = () => {
    setIsInActionView(false);
    setCurrentRound(roundsInput);
    setActiveSet(0);
  };

  const setRounds = (input: string) => {
    const rounds = Number(input) || 0;
    setCurrentRound(rounds);
    setRoundsInput(rounds);
  };

  const currentSet = exercise?.sets[activeSet];
  const nextSet = exercise?.sets[(activeSet + 1) % exercise.sets.length];

  return (
    <ScreenWrapper noPadding>
      {!isInActionView ? (
        <>
          <EvenRow>
            <Spacer axis="x" />

            <ExercisesModalButton onSelect={setExercise}>
              <FontAwesome name="list" size={24} color={theme.colors.white} />
            </ExercisesModalButton>
          </EvenRow>

          <Spacer spacing="xlarge" />
        </>
      ) : (
        <Header>
          <Subtitle typography="subtitle">
            Round {roundsInput - currentRound + 1} / {roundsInput}
          </Subtitle>

          <Title>{currentSet?.name}</Title>

          <Divider spacing="small" />

          <Subtitle typography="subtitle">Next: {nextSet?.name}</Subtitle>
        </Header>
      )}

      <TimerWrapper>
        <Timer
          name="sets"
          editable={false}
          showCentseconds
          rounds={currentRound}
          startTime={currentSet?.duration ?? 0}
          onTimeEnd={onSetEnd}
          onStart={() => setIsInActionView(true)}
          onStop={() => setIsInActionView(false)}
          onIsRunningChange={setIsRunning}
          onReset={onReset}
        />
      </TimerWrapper>

      {exercise && !isInActionView && (
        <SetRow>
          <EvenRow>
            <ExercisesModalButton
              exercise={exercise}
              onSelect={setExercise}
              noPadding
            >
              <Text>{exercise.name}</Text>

              <Spacer axis="x" />

              <FontAwesome name="pencil" size={16} color={theme.colors.grey} />
            </ExercisesModalButton>

            <Spacer fill />

            <BottomBarWrapper>
              <Text color="lightgrey">Rounds</Text>

              <Spacer axis="x" />

              <Input
                value={roundsInput.toString()}
                onChangeText={setRounds}
                keyboardType="number-pad"
                selectTextOnFocus
                alignRight
              />
            </BottomBarWrapper>
          </EvenRow>
        </SetRow>
      )}

      <SetsWrapper
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 32,
        }}
        ref={listRef}
      >
        {exercise && exercise.sets.length > 0 ? (
          exercise.sets.map((set, i) => (
            <Set
              key={`${set.name}-${i}`}
              isActive={isInActionView && activeSet === i}
              isRunning={isRunning}
              isInActionView={isInActionView}
              {...set}
            />
          ))
        ) : (
          <EmptySetsWrapper>
            <ExercisesModalButton onSelect={setExercise}>
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
  padding-top: ${(p) => p.theme.spacing.large};
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
`;

const BottomBarWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;
