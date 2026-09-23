import Svg, { Circle, Path, Rect } from "react-native-svg";
import { type GlyphName, isStrokeGlyph, type Shape, shapesOf } from "./glyph-data";

/**
 * One owned glyph at a size and colour. Decorative by default: the control that holds it carries
 * the accessible name (DESIGN.md: glyph + text, colour never alone).
 */
export function Glyph({
  name,
  size = 24,
  color,
}: {
  name: GlyphName;
  size?: number;
  color: string;
}) {
  const stroke = isStrokeGlyph(name);
  const paint: Paint = stroke
    ? {
        fill: "none",
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      }
    : { fill: color };
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {shapesOf(name).map((shape) => (
        // A glyph's shapes are fixed data and never repeat, so each keys by its own geometry.
        <ShapeView key={JSON.stringify(shape)} shape={shape} paint={paint} />
      ))}
    </Svg>
  );
}

type Paint =
  | { fill: string }
  | {
      fill: "none";
      stroke: string;
      strokeWidth: number;
      strokeLinecap: "round";
      strokeLinejoin: "round";
    };

function ShapeView({ shape, paint }: { shape: Shape; paint: Paint }) {
  switch (shape.kind) {
    case "path":
      return (
        <Path
          d={shape.d}
          fillRule={shape.evenOdd ? "evenodd" : "nonzero"}
          opacity={shape.opacity ?? 1}
          {...paint}
        />
      );
    case "circle":
      return <Circle cx={shape.cx} cy={shape.cy} r={shape.r} {...paint} />;
    case "rect":
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          opacity={shape.opacity ?? 1}
          {...paint}
        />
      );
  }
}
