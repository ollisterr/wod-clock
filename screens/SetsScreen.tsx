import { FontAwesome } from "@expo/vector-icons";
import React, { useRef, useState } from "react";

import {
  ScreenWrapper,
  Timer,
  Set,
  SpacedRow,
  IconButton,
} from "../components";
import { SetType } from "../components/types";
import { SECOND } from "../constants/time";
import styled from "../styles";
import { Input, Text } from "../styles/styles";
import theme from "../styles/theme";

export default function SetsScreen() {
  const [rounds, setRounds] = useState(1);
  const [sets, setSets] = useState<SetType[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(60);
  const [activeSet, setActiveSet] = useState<number>(0);

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

  const onReset = () => {
    setActiveSet(0);
    setRounds(1);
  };

  return (
    <ScreenWrapper noPadding>
      <TimerWrapper>
        <Timer
          ref={timerRef}
          editable={false}
          showCentseconds
          rounds={rounds}
          startTime={sets[activeSet]?.duration ?? 0}
          onTimeEnd={onSetEnd}
          onReset={onReset}
        />
      </TimerWrapper>

      <SetsWrapper>
        {sets.map((set, i) => (
          <Set
            key={set.name}
            isActive={activeSet === i}
            onRemove={() => removeSet(set)}
            {...set}
          />
        ))}

        <AddSetWrapper>
          <SpacedRow>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="New set..."
              flex
            />

            <Input
              value={duration.toString()}
              onChangeText={(x) => Number(x) && setDuration(Number(x))}
            />

            <Text>sec</Text>

            <IconButton onPress={addSet} size="large" disabled={!name}>
              <AddIcon name="plus" color={theme.colors.white} />
            </IconButton>
          </SpacedRow>
        </AddSetWrapper>
      </SetsWrapper>
    </ScreenWrapper>
  );
}

const TimerWrapper = styled.View`
  padding: ${(p) => p.theme.spacing.default};
`;

const AddSetWrapper = styled.View`
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
`;

const AddIcon = styled(FontAwesome)``;

const SetsWrapper = styled.View`
  padding-top: ${(p) => p.theme.spacing.default};
`;
