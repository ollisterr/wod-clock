import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { ScrollView } from "react-native-gesture-handler";
import styled from "../../styles";
import theme from "../../styles/theme";

interface Props {
  children: ReactNode;
}

export default function ScreenWrapper({ children }: Props) {
  return (
    <Wrapper>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ContentWrapper>{children}</ContentWrapper>
      </ScrollView>
    </Wrapper>
  );
}

const Wrapper = styled(LinearGradient).attrs({
  colors: [theme.colors.grey, theme.colors.black],
})`
  width: 100%;
  flex: 1;
`;

const ContentWrapper = styled.View`
  width: 100%;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: ${(p) => p.theme.spacing.default};
`;
