import { Selection } from "./Selection";

export class RectangularSelection extends Selection {
  public c?: number;
  public r?: number;

  public origin?: { x: number; y: number };

  public onMouseDown(position: { x: number; y: number }): void {
    this.origin = position;
  }

  public onMouseMove(position: { x: number; y: number }): void {
    this.resize(position);
  }

  public onMouseUp(position: { x: number; y: number }): void {
    this.resize(position);
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.c = position.x - this.origin.x;
      this.r = position.y - this.origin.y;
    }
  }
}
