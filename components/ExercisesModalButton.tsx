import React, { ReactNode, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { EvenRow, Text } from "../styles/styles";
import { getExercises } from "../utils/set.utils";
import Modal from "./common/Modal";
import { ExcerciseData, Exercise } from "./types";

interface Props {
  children: ReactNode;
  onSelect: (set: Exercise) => void;
}

export default function ExercisesModalButton({ children, onSelect }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState<ExcerciseData>({});

  useEffect(() => {
    getExercises().then((data) => !!data && setExercises(data));
  });

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        {children}
      </TouchableOpacity>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Text>Saved exercises</Text>

        {Object.values(exercises).map((exercise) => (
          <TouchableOpacity
            key={`${exercise.name}${exercise.timestamp}`}
            onPress={() => onSelect(exercise)}
          >
            <EvenRow>
              <Text>{exercise.name}</Text>

              <Text>{new Date(exercise.timestamp).toLocaleTimeString()}</Text>
            </EvenRow>
          </TouchableOpacity>
        ))}
      </Modal>
    </>
  );
}
