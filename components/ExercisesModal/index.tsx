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
}

export default function ExercisesModalButton({ children, onSelect }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<ExcerciseData>({});
  const [showExerciseDetails, toggleShowExerciseDetails] = useState(false);
  const [activeExercise, setActiveExercise] = useState<Exercise>();

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
      <ModalButton onPress={() => setIsModalOpen(true)}>{children}</ModalButton>

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
            exercise={activeExercise}
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
              setActiveExercise(exercise);
              toggleShowExerciseDetails(true);
            }}
            onClose={() => selectExercise(activeExercise)}
          />
        )}
      </Modal>
    </>
  );
}

const ModalButton = styled.TouchableOpacity`
  padding-horizontal: ${(p) => p.theme.spacing.large};
  padding-vertical: ${(p) => p.theme.spacing.medium};
`;
