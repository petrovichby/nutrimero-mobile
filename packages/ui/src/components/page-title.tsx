import { Text, type TextStyle } from "react-native";
import { useTheme } from "../theme/provider";

/**
 * A page title — the H1 of every Home Baker screen, present and future (DESIGN.md MA-25): Pacifico
 * at masthead metrics 31/46, heading ink, may wrap to two lines. Never for a step instruction
 * (baking mode's step headings stay in the UI face), body, rows, buttons or chips.
 */
export function PageTitle({ children, style }: { children: string; style?: TextStyle }) {
  const theme = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={[
        { fontFamily: theme.displayFace, fontSize: 31, lineHeight: 46, color: theme.color.heading },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
