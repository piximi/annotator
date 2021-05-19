import { AnnotationTool } from "../AnnotationTool";
import * as _ from "lodash";
import * as ImageJS from "image-js";
import { decode, encode } from "../../../rle";

export class EllipticalAnnotationTool extends AnnotationTool {
  center?: { x: number; y: number };
  origin?: { x: number; y: number };
  radius?: { x: number; y: number };

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

      this.points = this.convertToPoints();

      this._contour = this.points;

      this._mask = this.computeMask();

      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.annotated) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (this.radius) {
      this.annotated = true;

      this.annotating = false;

      this.points = this.convertToPoints();

      this._contour = this.points;

      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

      const mask = this.convertToMask();

      if (!mask) return;

      this._mask = encode(mask);

      const foo = decode(this._mask);
      const baz = new ImageJS.Image(this.image.width, this.image.height, foo, {
        components: 1,
        alpha: 0,
      }); //FIXME the decoded image does not look right
      // console.info(baz.toDataURL())
    }
  }

  private convertToMask() {
    const canvas = document.createElement("canvas");
    canvas.width = this.image.width;
    canvas.height = this.image.height;

    const ctx = canvas.getContext("2d");

    if (!ctx || !this.center || !this.radius) return undefined;

    ctx.beginPath();
    ctx.ellipse(
      this.center.x,
      this.center.y,
      this.radius.x,
      this.radius.y,
      2 * Math.PI,
      0,
      2 * Math.PI
    );
    ctx.fill();

    //@ts-ignore
    const imageMask = ImageJS.Image.fromCanvas(canvas).getChannel(3);

    for (let x = 0; x < imageMask.width; x++) {
      for (let y = 0; y < imageMask.height; y++) {
        if (imageMask.getPixelXY(x, y)[0] > 1) {
          imageMask.setPixelXY(x, y, [255]);
        } else {
          imageMask.setPixelXY(x, y, [0]);
        }
      }
    }

    return Uint8Array.from(imageMask.data);
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
