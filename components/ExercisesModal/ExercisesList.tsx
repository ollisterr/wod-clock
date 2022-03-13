import React from "react";
import { FontAwesome } from "@expo/vector-icons";

import { EmptyList, Subtitle, Text } from "../../styles/styles";

import { IconButton, Spacer } from "../common";
import { AddButton } from "../common/Button";
import { ExcerciseData, Exercise } from "../types";
import { HeaderRow, Row, SetsWrapper } from "./common";
import theme from "../../styles/theme";
import styled from "../../styles";
import { formatTimeStamp } from "../../utils/time.utils";

interface Props {
  exercises: ExcerciseData;
  onAddButtonPress: () => void;
  onExerciseSelect: (exercise: Exercise) => void;
  onExerciseEdit: (exercise: Exercise) => void;
  onClose: () => void;
}

export default function ExercisesList({
  exercises,
  onAddButtonPress,
  onExerciseSelect,
  onExerciseEdit,
}: Props) {
  const exerciseList = Object.values(exercises).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return (
    <>
      <HeaderRow>
        <Text>Saved exercises</Text>

        <AddButton onPress={onAddButtonPress} />
      </HeaderRow>

      <SetsWrapper contentContainerStyle={{ flexGrow: 1 }}>
        {exerciseList.length > 0 ? (
          exerciseList.map((exercise) => (
            <ExerciseTouchable
              key={`${exercise.name}${exercise.timestamp}`}
              onPress={() => onExerciseSelect(exercise)}
            >
              <Row>
                <Subtitle color="white">{exercise.name} </Subtitle>

                <Subtitle>
                  – {formatTimeStamp(new Date(exercise.timestamp))}
                </Subtitle>

                <Spacer axis="x" fill />

                <IconButton
                  size="large"
                  onPress={() => onExerciseEdit(exercise)}
                >
                  <FontAwesome name="pencil" color={theme.colors.white} />
                </IconButton>
              </Row>
            </ExerciseTouchable>
          ))
        ) : (
          <EmptyList>
            <Subtitle>No previous exercises</Subtitle>
          </EmptyList>
        )}
      </SetsWrapper>
    </>
  );
}

const ExerciseTouchable = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-bottom-color: rgba(150, 150, 150, 0.1);
`;
