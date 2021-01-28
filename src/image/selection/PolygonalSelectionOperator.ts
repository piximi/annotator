import { SelectionOperator } from "./SelectionOperator";

export class PolygonalSelectionOperator extends SelectionOperator {
  anchor?: { x: number; y: number };
  buffer: Array<number> = [];
  origin?: { x: number; y: number };
  points: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.connected(position)) {
      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this.buffer = [];

      this.origin = undefined;
    } else {
      if (this.buffer && this.buffer.length === 0) {
        this.selecting = true;

        if (!this.origin) {
          this.origin = position;
        }
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.anchor) {
      this.buffer.pop();

      this.buffer = [
        ...this.buffer,
        this.anchor.x,
        this.anchor.y,
        position.x,
        position.y,
      ];
    } else {
      if (this.origin) {
        this.buffer.pop();

        this.buffer = [
          ...this.buffer,
          this.origin.x,
          this.origin.y,
          position.x,
          position.y,
        ];
      }
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.connected(position)) {
      if (this.origin) {
        this.buffer = [
          ...this.buffer,
          position.x,
          position.y,
          this.origin.x,
          this.origin.y,
        ];
      }

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this.buffer = [];
    } else {
      if (this.buffer.length > 0) {
        this.anchor = position;

        if (!this.anchor) {
          if (this.origin) {
            this.buffer = [
              ...this.buffer,
              this.origin.x,
              this.origin.y,
              position.x,
              position.y,
            ];
          }
        } else {
          this.buffer = [
            ...this.buffer,
            this.anchor.x,
            this.anchor.y,
            position.x,
            position.y,
          ];
        }
      }
    }
  }

  select(category: number) {}

  private connected(
    position: { x: number; y: number },
    threshold: number = 2
  ): boolean | undefined {
    if (!this.origin) return undefined;

    const distance = Math.hypot(
      position.x - this.origin.x,
      position.y - this.origin.y
    );

    return distance < threshold;
  }
}
