import { BoundingBox } from "../../types/BoundingBox";
import { Instance } from "../../types/Instance";

export abstract class Selection {
  selected: boolean = false;

  selecting: boolean = false;

  selection?: Instance;

  abstract get boundingBox(): BoundingBox;

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  abstract select(category: string): void;
}
