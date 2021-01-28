import { SelectionOperator } from "./SelectionOperator";
import * as _ from "underscore";

export class PolygonalSelectionOperator extends SelectionOperator {
  anchor?: { x: number; y: number };

  connected: boolean = false;

  origin?: { x: number; y: number };

  points: Array<number> = [];

  shape: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.connected) {
      this.selected = true;
      this.selecting = false;

      this.shape = this.points;

      this.points = [];

      this.origin = undefined;
    } else {
      if (this.points && this.points.length === 0) {
        this.selecting = true;

        if (!this.origin) {
          this.origin = position;
        }
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.anchor) {
      this.points.pop();

      this.points = [
        ...this.points,
        this.anchor.x,
        this.anchor.y,
        position.x,
        position.y,
      ];
    } else {
      if (this.origin) {
        this.points.pop();

        this.points = [
          ...this.points,
          this.origin.x,
          this.origin.y,
          position.x,
          position.y,
        ];
      }
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.connected) {
      if (this.origin) {
        this.points = [
          ...this.points,
          position.x,
          position.y,
          this.origin.x,
          this.origin.y,
        ];
      }

      this.selected = true;
      this.selecting = false;

      this.shape = this.points;

      this.points = [];
    } else {
      if (this.points.length > 0) {
        this.anchor = position;

        if (!this.anchor) {
          if (this.origin) {
            this.points = [
              ...this.points,
              this.origin.x,
              this.origin.y,
              position.x,
              position.y,
            ];
          }
        } else {
          this.points = [
            ...this.points,
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
}
