import React, { ReactNode } from "react";

import { screenHeight } from "../../constants/layout";
import styled from "../../styles";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  noPadding?: boolean;
}

export default function ExercisesModal({
  children,
  isOpen,
  onClose,
  noPadding = false,
}: Props) {
  return (
    <ModalWrapper
      visible={isOpen}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Backdrop onPress={onClose} activeOpacity={1}>
        <ContentWrapper noPadding={noPadding}>{children}</ContentWrapper>
      </Backdrop>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.Modal`
  width: 100%;
  height: 100%;
`;

const Backdrop = styled.TouchableOpacity`
  position: absolute;
  height: 100%;
  width: 100%;
  padding: ${(p) => p.theme.spacing.default};
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ContentWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})<{ noPadding: boolean }>`
  width: 100%;
  flex: 1;
  max-height: ${screenHeight * 0.7}px;
  border-radius: ${(p) => p.theme.borderRadius.default};
  ${(p) => !p.noPadding && `padding: ${p.theme.spacing.default};`}
  background-color: ${(p) => p.theme.colors.black};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  elevation: 10;
`;
