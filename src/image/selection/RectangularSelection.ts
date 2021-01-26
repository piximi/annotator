import {Selection} from "./Selection";

export default class RectangularSelection extends Selection {
  public c?: number;
  public r?: number;

  public origin?: { x: number; y: number };

  public deselect() {
    this.selected = false;

    this.selecting = false;
  }

  public onMouseDown(position: { x: number; y: number }): void {
    if (this.selected) return;

    this.origin = position;

    this.selecting = true;
  }

  public onMouseMove(position: { x: number; y: number }): void {
    if (this.selected) return;

    this.resize(position);
  }

  public onMouseUp(position: { x: number; y: number }): void {
    if (this.selected || !this.selecting) return;

    this.resize(position);

    this.selected = true;

    this.selecting = false;
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.c = position.x - this.origin.x;
      this.r = position.y - this.origin.y;
    }
  }
}
