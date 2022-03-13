import React, { ReactNode, useState, useEffect } from "react";

import styled from "../../styles";
import ExerciseDetails from "./ExerciseDetails";
import { getExercises, storeExercise } from "../../utils/timer.utils";
import Modal from "../common/Modal";
import ExercisesList from "./ExercisesList";
import { ExcerciseData, Exercise } from "../types";

interface Props {
  children: ReactNode;
  onSelect: (set?: Exercise) => void;
  exercise?: Exercise;
  noPadding?: boolean;
}

export default function ExercisesModalButton({
  children,
  onSelect,
  exercise,
  noPadding,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<ExcerciseData>({});
  const [showExerciseDetails, toggleShowExerciseDetails] = useState(false);

  useEffect(() => {
    if (isModalOpen && exercise) {
      toggleShowExerciseDetails(true);
    }
  }, [isModalOpen]);

  useEffect(() => {
    getExercises().then((data) => !!data && setExercises(data));
  }, []);

  const saveExercise = async (exercise: Exercise) => {
    try {
      setExercises((x) => ({ ...x, [exercise.name]: exercise }));
      await storeExercise(exercise);
      return true;
    } catch {
      return false;
    }
  };

  const selectExercise = (exercise?: Exercise) => {
    onSelect(exercise);
    setIsModalOpen(false);
  };

  return (
    <>
      <ModalButton onPress={() => setIsModalOpen(true)} noPadding={noPadding}>
        {children}
      </ModalButton>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          toggleShowExerciseDetails(false);
        }}
        noPadding
      >
        {showExerciseDetails ? (
          <ExerciseDetails
            exercise={exercise}
            onSave={saveExercise}
            onConfirm={selectExercise}
            onClose={() => toggleShowExerciseDetails(false)}
          />
        ) : (
          <ExercisesList
            exercises={exercises}
            onAddButtonPress={() => toggleShowExerciseDetails(true)}
            onExerciseSelect={selectExercise}
            onExerciseEdit={(exercise) => {
              onSelect(exercise);
              toggleShowExerciseDetails(true);
            }}
          />
        )}
      </Modal>
    </>
  );
}

const ModalButton = styled.TouchableOpacity<{ noPadding?: boolean }>`
  flex-direction: row;
  align-items: center;
  ${(p) => !p.noPadding && `padding-horizontal: ${p.theme.spacing.large};`}
  ${(p) => !p.noPadding && `padding-vertical: ${p.theme.spacing.medium};`}
  color: ${(p) => p.theme.colors.white};
`;
