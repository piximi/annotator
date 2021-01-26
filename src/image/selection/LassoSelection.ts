import { BoundingBox } from "../../types/BoundingBox";
import { Selection } from "./Selection";

export class LassoSelection extends Selection {
  get boundingBox(): BoundingBox {
    return [0, 0, 0, 0];
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: string) {};
}
