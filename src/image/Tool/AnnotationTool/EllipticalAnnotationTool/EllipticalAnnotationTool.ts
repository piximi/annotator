import { AnnotationTool } from "../AnnotationTool";
import * as _ from "lodash";

export class EllipticalAnnotationTool extends AnnotationTool {
  center?: { x: number; y: number };
  origin?: { x: number; y: number };
  radius?: { x: number; y: number };

  computeBoundingBox(): [number, number, number, number] | undefined {
    if (!this.center || !this.origin || !this.radius) return undefined;

    if (!this.stagedImageShape) return undefined;

    //true image coordinates
    const origin = this.toImageSpace(this.origin);
    const radius = this.toImageSpace(this.radius);
    const center = this.toImageSpace(this.center);

    return [
      Math.round(origin.x),
      Math.round(origin.y),
      Math.round(center.x + radius.x),
      Math.round(center.y + radius.y),
    ];
  }

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.center = undefined;
    this.origin = undefined;
    this.radius = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.radius) {
      this.origin = position;

      this.annotating = true;
    } else {
      this.resize(position);

      this.annotated = true;

      this.annotating = false;

      this.points = this.translateStagedPointsToImagePoints(
        this.convertToPoints()
      );

      this._contour = this.points;

      this._mask = this.computeMask();

      this._boundingBox = this.computeBoundingBox();
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.annotated) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (this.radius) {
      this.resize(position);

      this.annotated = true;

      this.annotating = false;

      this.points = this.translateStagedPointsToImagePoints(
        this.convertToPoints()
      );

      this._contour = this.points;

      this._mask = this.computeMask();

      this._boundingBox = this.computeBoundingBox();
    }
  }

  private convertToPoints() {
    if (!this.radius || !this.origin || !this.center) return [];

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
