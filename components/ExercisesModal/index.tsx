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
  const [selectedExercise, setSelectedExercise] = useState<
    Exercise | undefined
  >(exercise);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<ExcerciseData>({});
  const [showExerciseDetails, toggleShowExerciseDetails] = useState(false);

  useEffect(() => {
    setSelectedExercise(exercise);

    if (isModalOpen) toggleShowExerciseDetails(true);
  }, [exercise, isModalOpen]);

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

  const addExercise = () => {
    const exercise: Exercise = {
      name: "New Exercise",
      timestamp: Date.now(),
      sets: [],
    };

    setSelectedExercise(exercise);
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
        {selectedExercise && showExerciseDetails ? (
          <ExerciseDetails
            exercise={selectedExercise}
            onSave={saveExercise}
            onConfirm={selectExercise}
            onClose={() => setSelectedExercise(undefined)}
          />
        ) : (
          <ExercisesList
            exercises={exercises}
            onAddButtonPress={addExercise}
            onExerciseSelect={selectExercise}
            onExerciseEdit={(exercise) => {
              setSelectedExercise(exercise);
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
