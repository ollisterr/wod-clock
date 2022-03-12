import styled from "../../styles";
import { EvenRow } from "../../styles/styles";

export const SetsWrapper = styled.ScrollView`
  flex: 1;
`;

export const Row = styled(EvenRow)`
  width: 100%;
  padding-horizontal: ${(p) => p.theme.spacing.default};
  padding-vertical: ${(p) => p.theme.spacing.small};
`;

export const HeaderRow = styled(Row)`
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(150, 150, 150, 0.1);
  border-bottom-width: 1px;
`;

export const BottomRow = styled(Row)`
  flex-direction: column;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.5);
  border-top-color: rgba(150, 150, 150, 0.1);
  border-top-width: 1px;
`;
