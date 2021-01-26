import { BoundingBox } from "../../types/BoundingBox";
import { Selection } from "./Selection";

export class RectangularSelection extends Selection {
  c?: number;
  r?: number;

  origin?: { x: number; y: number };

  get boundingBox(): BoundingBox {
    return { maximum: { r: 0, c: 0 }, minimum: { r: 0, c: 0 }};
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

  select() {
    this.deselect();
  };

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.c = position.x - this.origin.x;
      this.r = position.y - this.origin.y;
    }
  }
}
