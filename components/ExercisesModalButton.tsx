import { FontAwesome } from "@expo/vector-icons";
import React, { ReactNode, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { screenWidth } from "../constants/Layout";
import styled from "../styles";

import { EmptyList, EvenRow, Subtitle, Text } from "../styles/styles";
import { getExercises } from "../utils/timer.utils";
import { AddButton, IconButton } from "./common/Button";
import Modal from "./common/Modal";
import { ExcerciseData, Exercise } from "./types";

interface Props {
  children: ReactNode;
  onSelect: (set: Exercise) => void;
}

export default function ExercisesModalButton({ children, onSelect }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<ExcerciseData>({});
  const [showExerciseDetails, toggleShowExerciseDetails] = useState(false);

  useEffect(() => {
    getExercises().then((data) => !!data && setExercises(data));
  });

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        {children}
      </TouchableOpacity>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        noPadding
      >
        <HeaderRow>
          <Text>Saved exercises</Text>

          <AddButton onPress={() => toggleShowExerciseDetails(true)} />
        </HeaderRow>

        <SetsWrapper contentContainerStyle={{ flexGrow: 1 }}>
          {Object.values(exercises).length > 0 ? (
            Object.values(exercises).map((exercise) => (
              <TouchableOpacity
                key={`${exercise.name}${exercise.timestamp}`}
                onPress={() => onSelect(exercise)}
              >
                <Row>
                  <Text>{exercise.name}</Text>

                  <Text>
                    {new Date(exercise.timestamp).toLocaleTimeString()}
                  </Text>

                  <IconButton>
                    <FontAwesome name="pencil" />
                  </IconButton>
                </Row>
              </TouchableOpacity>
            ))
          ) : (
            <EmptyList>
              <Subtitle>No previous exercises</Subtitle>
            </EmptyList>
          )}
        </SetsWrapper>
      </Modal>
    </>
  );
}

const Row = styled(EvenRow)`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.default};
  padding-vertical: ${(p) => p.theme.spacing.small};
`;

const HeaderRow = styled(Row)`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(150, 150, 150, 0.1);
  border-bottom-width: 1px;
`;

const SetsWrapper = styled.ScrollView`
  min-height: ${screenWidth / 1.5}px;
  max-height: ${screenWidth / 1.2}px;
`;
