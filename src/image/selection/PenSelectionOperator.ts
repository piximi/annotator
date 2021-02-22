import { SelectionOperator } from "./SelectionOperator";

export class PenSelectionOperator extends SelectionOperator {
  brushSize: number = 8;
  buffer: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour(): Array<number> | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    this.selecting = true;

    this.buffer = [...this.buffer, position.x, position.y];
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.buffer = [...this.buffer, position.x, position.y];
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.selected = true;

    this.selecting = false;
  }
}
