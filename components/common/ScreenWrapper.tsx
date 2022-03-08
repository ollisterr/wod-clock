import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";

import { ScrollView } from "react-native-gesture-handler";
import styled from "../../styles";
import theme from "../../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  noPadding?: boolean;
}

export default function ScreenWrapper({ children, ...rest }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Wrapper style={{ paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <ContentWrapper {...rest}>{children}</ContentWrapper>
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

const ContentWrapper = styled.View<{ noPadding?: boolean }>`
  width: 100%;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.noPadding ? "0px" : p.theme.spacing.default)};
`;
