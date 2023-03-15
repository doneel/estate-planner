import { cube } from "@jscad/modeling/src/primitives";
import { Renderer } from "jscad-react";

export default function CadRender() {
  return <Renderer solids={[cube({ size: 12, center: [0, 0, 6] })]} height={500} width={500} />;
}
