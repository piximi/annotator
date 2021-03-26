import { AnnotationTool } from "../AnnotationTool";
import * as _ from "lodash";

export class RectangularAnnotationTool extends AnnotationTool {
  origin?: { x: number; y: number };

  width?: number;
  height?: number;

  computeBoundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.width || !this.height) return undefined;

    if (!this.stagedImageShape) return undefined;

    //true image coordinates
    const origin = this.toImageSpace(this.origin);
    const width = Math.floor(
      (this.width * this.image.width) / this.stagedImageShape.width
    );
    const height = Math.floor(
      (this.height * this.image.height) / this.stagedImageShape.height
    );

    return [origin.x, origin.y, origin.x + width, origin.y + height];
  }

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.origin = undefined;

    this.width = undefined;
    this.height = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.width) {
      this.origin = position;

      this.annotating = true;
    } else {
      this.resize(position);

      this.points = this.translateStagedPointsToImagePoints(
        this.convertToPoints()
      );

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBox();

      this.annotated = true;
      this.annotating = false;
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.annotated) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (this.width) {
      this.resize(position);

      this.points = this.translateStagedPointsToImagePoints(
        this.convertToPoints()
      );

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBox();

      this.annotated = true;
      this.annotating = false;
    }
  }

  private convertToPoints() {
    if (!this.width || !this.height || !this.origin) return [];

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
