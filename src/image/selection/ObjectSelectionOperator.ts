import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    super.onMouseDown(position);
  }

  onMouseMove(position: { x: number; y: number }) {
    super.onMouseMove(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);
  }

  select(category: Category) {}

  private predict() {}
}
