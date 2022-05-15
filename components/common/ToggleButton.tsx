import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "../../styles";
import theme from "../../styles/theme";

interface Props {
  value: boolean;
  onChange: () => void;
}

const HANDLE_SIZE = 28;

export default function ToggleButton({ value, onChange }: Props) {
  const color = useRef(new Animated.Value(value ? 1 : 0)).current;
  const position = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(color, {
          toValue: value ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(position, {
          toValue: value ? 1 : 0,
          duration: 150,
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [value]);

  const backgroundColor = color.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.lightgrey, theme.colors.primary],
  });

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, HANDLE_SIZE],
  });

  return (
    <TouchableOpacity onPress={onChange} activeOpacity={1}>
      <Wrapper style={{ backgroundColor }}>
        <Handle style={{ transform: [{ translateX }] }} />
      </Wrapper>
    </TouchableOpacity>
  );
}

const Wrapper = styled(Animated.View)`
  width: ${HANDLE_SIZE * 2 + 6}px;
  height: ${HANDLE_SIZE + 6}px;
  border-radius: ${(p) => p.theme.borderRadius.pill};
  border: solid 3px ${(p) => p.theme.colors.grey};
`;

const Handle = styled(Animated.View)`
  position: absolute;
  height: ${HANDLE_SIZE}px;
  width: ${HANDLE_SIZE}px;
  border-radius: ${(p) => p.theme.borderRadius.pill};
  background-color: ${(p) => p.theme.colors.whitesmoke};
  elevation: 5;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
`;
