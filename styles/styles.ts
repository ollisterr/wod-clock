import styled from ".";

export const RoundButton = styled.TouchableHighlight`
  background-color: ${(p) => p.theme.colors.peach};
  border-radius: ${(p) => p.theme.borderRadius.pill};
`;

export const EvenRow = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
