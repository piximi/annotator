import { SelectionTool } from "../SelectionTool";
import * as _ from "lodash";

export class LassoSelectionTool extends SelectionTool {
  anchor?: { x: number; y: number };
  buffer: Array<number> = [];
  origin?: { x: number; y: number };
  points: Array<number> = [];

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.selection = undefined;

    this.anchor = undefined;
    this.buffer = [];
    this.origin = undefined;
    this.points = [];
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (this.connected(position)) {
      if (this.origin) {
        this.buffer = [...this.buffer, this.origin.x, this.origin.y];
      }

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

      this.anchor = undefined;
      this.origin = undefined;
    }

    if (this.buffer && this.buffer.length === 0) {
      this.selecting = true;

      if (!this.origin) {
        this.origin = position;
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    if (this.anchor) {
      if (
        this.buffer[this.buffer.length - 2] !== this.anchor.x ||
        this.buffer[this.buffer.length - 1] !== this.anchor.y
      ) {
        this.buffer.pop();
        this.buffer.pop();
      }

      this.buffer = [...this.buffer, position.x, position.y];

      return;
    }

    if (this.origin) {
      this.buffer = [...this.buffer, position.x, position.y];
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    if (
      this.connected(position) &&
      this.origin &&
      this.buffer &&
      this.buffer.length > 0
    ) {
      this.buffer = [
        ...this.buffer,
        position.x,
        position.y,
        this.origin.x,
        this.origin.y,
      ];

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;
      this._contour = this.points;

      this._mask = this.computeMask();

      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

      this.buffer = [];
    }

    if (this.anchor) {
      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [...this.buffer, position.x, position.y];

      this.anchor = position;

      return;
    }

    if (this.origin && this.buffer && this.buffer.length > 0) {
      this.anchor = position;
      return;
    }
  }

  private connected(
    position: { x: number; y: number },
    threshold: number = 4
  ): boolean | undefined {
    if (!this.origin) return undefined;

    const distance = Math.hypot(
      position.x - this.origin.x,
      position.y - this.origin.y
    );

    return distance < threshold;
  }
}
