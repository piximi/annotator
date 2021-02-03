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

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);

    // do stuff
  }

  select(category: Category) {}

  private predict() {}
}
