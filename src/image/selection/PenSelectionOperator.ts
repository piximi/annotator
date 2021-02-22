import { SelectionOperator } from "./SelectionOperator";

export class PenSelectionOperator extends SelectionOperator {
  private pixels: Array<{ x: number; y: number }> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour(): Array<number> | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}
}
