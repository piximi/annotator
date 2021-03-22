import { AnnotationTool } from "../AnnotationTool";
import { slic } from "../../../slic";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { encode } from "../../../rle";

export class QuickAnnotationTool extends AnnotationTool {
  currentData?: Int32Array;
  colorMasks?: Array<string>;
  currentSuperpixel?: number;
  superpixels?: Int32Array;
  currentMask?: ImageJS.Image;
  map?: Uint8Array | Uint8ClampedArray;
  masks?: { [key: number]: Array<Int32Array | ImageJS.Image> };

  computeObjectSelectionMask(): Array<number> | undefined {
    if (!this.currentMask) return;

    const greyData = this.currentMask.grey();

    const binaryMask = new ImageJS.Image(
      this.currentMask.width,
      this.currentMask.height,
      {
        alpha: 0,
        bitDepth: 1,
        components: 1,
      }
    );

    for (let x = 0; x < binaryMask.width; x++) {
      for (let y = 0; y < binaryMask.height; y++) {
        if (greyData.getPixelXY(x, y)[0] > 0) {
          binaryMask.setBitXY(x, y);
        }
      }
    }

    return encode(binaryMask.data as Uint8Array);
  }

  filter(): {
    count: number;
    map: Uint8Array | Uint8ClampedArray;
    superpixels: Int32Array;
  } {
    const data = this.image.getRGBAData();

    const { count, map, superpixels } = slic(
      data,
      this.image.width,
      this.image.height,
      40
    );

    return { count, map, superpixels };
  }

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.currentData = undefined;
    this.colorMasks = undefined;
    this.currentSuperpixel = undefined;
    this.currentMask = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.superpixels || !this.masks) return;

    const pixel =
      Math.round(position.x) + Math.round(position.y) * this.image.width;

    this.currentSuperpixel = this.superpixels[pixel];

    const mask = this.masks[this.currentSuperpixel];

    this.currentMask = mask[2] as ImageJS.Image;
    this.currentData = mask[1] as Int32Array;

    this.annotating = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.superpixels || !this.masks) return;

    const pixel =
      Math.round(position.x) + Math.round(position.y) * this.image.width;
    const superpixel = this.superpixels[pixel];

    if (superpixel === this.currentSuperpixel) return; // don't draw superpixel mask if already on that superpixel

    this.currentSuperpixel = superpixel;

    const mask = this.masks[superpixel];

    this.currentMask = mask[2] as ImageJS.Image;

    if (!this.annotating) return;

    if (!this.currentData) return;

    const colorData = mask[1] as Int32Array;

    this.currentData = this.addImages(colorData, this.currentData);
    this.currentMask = new ImageJS.Image(
      this.image.width,
      this.image.height,
      this.currentData
    );
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (!this.currentMask) return;

    const greyData = this.currentMask.grey();

    // @ts-ignore
    const greyMatrix = greyData.getMatrix().data;
    const bar = greyMatrix.map((el: Array<number>) => {
      return Array.from(el);
    });
    const largest: Array<Array<number>> = this.computeContours(bar);

    this.points = _.flatten(
      largest.map((coord) => {
        return [Math.round(coord[0]), Math.round(coord[1])];
      })
    );

    this._contour = this.points;
    this._mask = this.computeObjectSelectionMask();
    this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

    this.annotated = true;
    this.annotating = false;
  }

  private static colorSuperpixelMap(mask: ImageJS.Image, color: string) {
    const fillColor = [255, 0, 0, 150];

    const foo: Array<Array<number>> = [];
    for (let y = 0; y < mask.height; y++) {
      for (let x = 0; x < mask.width; x++) {
        if (mask.getPixelXY(x, y)[0] === 255) {
          foo.push(fillColor);
        } else {
          foo.push([0, 0, 0, 0]);
        }
      }
    }

    let overlay = new ImageJS.Image(
      mask.width,
      mask.height,
      new Uint8Array(mask.width * mask.height * 4),
      { alpha: 1 }
    );
    // roiPaint doesn't respect alpha, so we'll paint it ourselves.
    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        if (mask.getPixelXY(x, y)[0] === 255) {
          overlay.setPixelXY(x, y, fillColor);
        } else {
          overlay.setPixelXY(x, y, [0, 0, 0, 0]);
        }
      }
    }

    return [Int32Array.from(_.flatten(foo)), overlay];
  }

  private addImages(foo: Int32Array, bar: Int32Array) {
    return foo.map((el, i) => {
      if ((i + 1) % 4 === 0) {
        // opacity should not be added
        return Math.max(el, bar[i]);
      } else {
        return Math.min(el + bar[i], 255); //FIXME this is going to be wrong for mixed colors (not just R, G or B)
      }
    });
  }

  static setup(image: ImageJS.Image) {
    const instance = new QuickAnnotationTool(image);

    const { count, map, superpixels } = instance.filter();

    instance.map = map;

    instance.superpixels = superpixels;

    const unique = _.uniq(superpixels);

    const masks: { [key: number]: Array<Int32Array | ImageJS.Image> } = {};

    _.forEach(unique, (superpixel) => {
      const binaryData = superpixels.map((pixel: number) => {
        if (pixel === superpixel) {
          return 255;
        } else {
          return 0;
        }
      });

      const binaryImage = new ImageJS.Image(
        image.width,
        image.height,
        binaryData,
        { components: 1, alpha: 0 }
      );

      const [colorData, colorMask] = QuickAnnotationTool.colorSuperpixelMap(
        binaryImage,
        "green"
      );

      masks[superpixel] = [binaryData, colorData, colorMask];
    });

    instance.masks = masks;

    return instance;
  }
}
