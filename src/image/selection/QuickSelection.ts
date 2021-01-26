import { BoundingBox } from "../../types/BoundingBox";
import { Selection } from "./Selection";

export class QuickSelection extends Selection {
  get boundingBox(): BoundingBox {
    return { maximum: { r: 0, c: 0 }, minimum: { r: 0, c: 0 }};
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select() {};
}
