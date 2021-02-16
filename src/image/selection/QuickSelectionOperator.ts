import { SelectionOperator } from "./SelectionOperator";
import { Category } from "../../types/Category";

export class QuickSelectionOperator extends SelectionOperator {
  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour() {
    return [];
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: Category) {}
}
