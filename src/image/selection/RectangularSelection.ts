import { Selection } from "./Selection";

export class RectangularSelection extends Selection {
  origin?: { x: number; y: number };

  x?: number;
  y?: number;

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.x || !this.y) return undefined;

    return [
      this.origin.x,
      this.origin.y,
      this.origin.x + this.x,
      this.origin.y + this.y
    ];
  }

  deselect() {
    this.selected = false;

    this.selecting = false;
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

    this.selected = true;

    this.selecting = false;
  }

  select(category: string) {
    this.deselect();
  };

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.x = position.x - this.origin.x;
      this.y = position.y - this.origin.y;
    }
  }
}
