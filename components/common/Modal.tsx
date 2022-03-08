import React, { ReactNode } from "react";

import styled from "../../styles";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExercisesModal({ children, isOpen, onClose }: Props) {
  return (
    <ModalWrapper
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Backdrop onPress={onClose} activeOpacity={1}>
        <ContentWrapper>{children}</ContentWrapper>
      </Backdrop>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.Modal`
  width: 100%;
  height: 100%;
  border: solid 2px red;
`;

const Backdrop = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ContentWrapper = styled.TouchableOpacity.attrs({
  disabled: true,
  activeOpacity: 1,
})`
  width: 100%;
  border-radius: ${(p) => p.theme.borderRadius};
  padding: ${(p) => p.theme.spacing.default};
`;
