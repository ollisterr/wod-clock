import React, { ReactNode } from "react";

import styled from "../../styles";
import { Spacing } from "../../styles/theme";
import Spacer from "./Spacer";

interface Props {
  children: ReactNode;
  spacing?: Spacing;
}

export default function SpacedRow({ children, spacing = "default" }: Props) {
  return (
    <Wrapper>
      {React.Children.map(children, (child, i) => (
        <>
          {i > 0 && <Spacer axis="x" spacing={spacing} />}
          {child}
        </>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;
