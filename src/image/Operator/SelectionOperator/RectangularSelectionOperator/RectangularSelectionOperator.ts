import { SelectionOperator } from "../SelectionOperator/SelectionOperator";

export class RectangularSelectionOperator extends SelectionOperator {
  origin?: { x: number; y: number };

  width?: number;
  height?: number;

  computeBoundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.width || !this.height) return undefined;

    return [
      Math.round(this.origin.x),
      Math.round(this.origin.y),
      Math.round(this.origin.x + this.width),
      Math.round(this.origin.y + this.height),
    ];
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

    if (!this.width) {
      this.origin = position;

      this.selecting = true;
    } else {
      this.resize(position);

      this.points = this.convertToPoints();

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBox();

      this.selected = true;
      this.selecting = false;
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    if (this.width) {
      this.resize(position);
      this.points = this.convertToPoints();

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBox();

      this.selected = true;
      this.selecting = false;
    }
  }

  private convertToPoints() {
    if (!this.width || !this.height || !this.origin) return;

    const points: Array<number> = [];

    const origin = { x: this.origin.x, y: this.origin.y };
    let width = this.width;
    let height = this.height;

    //negative height and width may happen if the rectangle was drawn from right to left
    if (this.width < 0) {
      width = Math.abs(this.width);
      origin.x = this.origin.x - width;
    }
    if (this.height < 0) {
      height = Math.abs(this.height);
      origin.y = this.origin.y - height;
    }

    // four edges of the rectangle
    for (let x = 0; x < width; x++) {
      points.push(Math.round(x + origin.x));
      points.push(Math.round(origin.y));
    }
    for (let y = 0; y < height; y++) {
      points.push(Math.round(origin.x + width - 1));
      points.push(Math.round(y + origin.y));
    }
    for (let x = width - 1; x >= 0; x--) {
      points.push(Math.round(x + origin.x));
      points.push(Math.round(origin.y + height - 1));
    }
    for (let y = height - 1; y >= 0; y--) {
      points.push(Math.round(origin.x));
      points.push(Math.round(y + origin.y));
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
