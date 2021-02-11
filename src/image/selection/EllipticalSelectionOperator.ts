import { SelectionOperator } from "./SelectionOperator";
import { Category } from "../../types/Category";
import * as _ from "lodash";

export class EllipticalSelectionOperator extends SelectionOperator {
  center?: { x: number; y: number };
  origin?: { x: number; y: number };
  radius?: { x: number; y: number };

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.center || !this.origin || !this.radius) return undefined;

    return [
      this.origin.x,
      this.origin.y,
      this.center.x + this.radius.x,
      this.center.y + this.radius.y,
    ];
  }

  get contour() {
    return this.convertToPoints();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.center = undefined;
    this.origin = undefined;
    this.radius = undefined;
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

    this.points = this.convertToPoints();
  }

  private convertToPoints() {
    if (!this.radius || !this.origin || !this.center) return;

    const centerX = Math.round(this.center.x);
    const centerY = Math.round(this.center.y);

    const points: Array<number> = [];
    const foo: Array<Array<number>> = [];
    //first quadrant points
    for (let y = centerY; y < centerY + this.radius.y; y += 0.5) {
      const x =
        this.radius.x *
          Math.sqrt(
            1 -
              ((y - centerY) * (y - centerY)) / (this.radius.y * this.radius.y)
          ) +
        centerX;
      points.push(Math.round(x));
      points.push(Math.round(y));
      foo.push([Math.round(x), Math.round(y)]);
    }
    // const reversedFoo = _.reverse(foo);
    //second quadrant points
    _.forEachRight(foo, (position: Array<number>) => {
      let x = 2 * centerX - position[0];
      points.push(x);
      points.push(position[1]);
    });
    //third quadrant points
    _.forEach(foo, (position: Array<number>) => {
      let x = 2 * centerX - position[0];
      let y = 2 * centerY - position[1];
      points.push(x);
      points.push(y);
    });
    //fourth quadant points
    _.forEachRight(foo, (position: Array<number>) => {
      let y = 2 * centerY - position[1];
      points.push(position[0]);
      points.push(y);
    });

    return points;
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.center = {
        x: (position.x - this.origin.x) / 2 + this.origin.x,
        y: (position.y - this.origin.y) / 2 + this.origin.y,
      };

      this.radius = {
        x: Math.abs((position.x - this.origin.x) / 2),
        y: Math.abs((position.y - this.origin.y) / 2),
      };
    }
  }
}
