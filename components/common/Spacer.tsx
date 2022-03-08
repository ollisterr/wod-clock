import { Spacing } from "../../styles/theme";
import styled from "../../styles";

interface Props {
  axis?: "x" | "y";
  spacing?: Spacing;
  fill?: boolean;
}

const Spacer = styled.View<Props>`
  width: ${(p) =>
    (p.axis ?? "y") === "x" ? p.theme.spacing[p.spacing ?? "default"] : "100%"};
  height: ${(p) =>
    (p.axis ?? "y") === "x" ? "1px" : p.theme.spacing[p.spacing ?? "default"]};
  ${(p) => p.fill && "flex: 1;"}
`;

export default Spacer;
