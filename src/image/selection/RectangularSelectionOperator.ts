import { SelectionOperator } from "./SelectionOperator";
import { Category } from "../../types/Category";

export class RectangularSelectionOperator extends SelectionOperator {
  origin?: { x: number; y: number };

  width?: number;
  height?: number;

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.width || !this.height) return undefined;

    return [
      Math.round(this.origin.x),
      Math.round(this.origin.y),
      Math.round(this.origin.x + this.width),
      Math.round(this.origin.y + this.height),
    ];
  }

  get contour() {
    return this.convertToPoints();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.origin = undefined;

    this.width = undefined;
    this.height = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    this.origin = position;

    this.selecting = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.resize(position);

    this.points = this.convertToPoints();

    this.selected = true;
    this.selecting = false;
  }

  private convertToPoints() {
    if (!this.width || !this.height || !this.origin) return;

    const points: Array<number> = [];

    // four edges of the rectangle
    for (let x = 0; x < this.width; x++) {
      points.push(Math.round(x + this.origin.x));
      points.push(Math.round(this.origin.y));
    }
    for (let y = 0; y < this.height; y++) {
      points.push(Math.round(this.origin.x + this.width - 1));
      points.push(Math.round(y + this.origin.y));
    }
    for (let x = this.width - 1; x >= 0; x--) {
      points.push(Math.round(x + this.origin.x));
      points.push(Math.round(this.origin.y + this.height - 1));
    }
    for (let y = this.height - 1; y >= 0; y--) {
      points.push(Math.round(this.origin.x));
      points.push(Math.round(y + this.origin.y));
    }

    return points;
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.width = position.x - this.origin.x;
      this.height = position.y - this.origin.y;
    }
  }
}
