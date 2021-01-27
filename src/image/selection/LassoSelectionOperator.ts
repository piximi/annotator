import { SelectionOperator } from "./SelectionOperator";

export class LassoSelectionOperator extends SelectionOperator {
  connected: boolean = false;

  origin?: { x: number, y: number };

  points: Array<{ x: number, y: number }> = [];

  strokes: Array<Array<number>> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: number) {};
}
