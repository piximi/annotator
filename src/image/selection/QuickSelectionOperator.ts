import { SelectionOperator } from "./SelectionOperator";
import { SuperpixelArray } from "../../types/SuperpixelArray";
import { slic } from "../slic";
import * as ImageJS from "image-js";
import * as _ from "lodash";

export class QuickSelectionOperator extends SelectionOperator {
  currentData?: Int32Array;
  colorMasks?: Array<string>;
  superpixels?: Int32Array;
  currentMask?: ImageJS.Image;
  // maps pixel position to superpixel index
  map?: Uint8Array | Uint8ClampedArray;
  masks?: Array<Array<number | Int32Array | ImageJS.Image>>;

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour() {
    return [];
  }

  get mask(): string | undefined {
    return undefined;
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
      100
    );

    return { count, map, superpixels };
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (!this.superpixels || !this.masks) return;

    const pixel =
      Math.round(position.x) + Math.round(position.y) * this.image.width;

    const superpixel = this.superpixels[pixel];

    const mask = _.filter(this.masks, ([key, binaryMask, colorMask]) => {
      return key === superpixel;
    });

    this.currentMask = mask[0][3] as ImageJS.Image;
    this.currentData = mask[0][2] as Int32Array;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.superpixels || !this.masks) return;

    const pixel =
      Math.round(position.x) + Math.round(position.y) * this.image.width;
    const superpixel = this.superpixels[pixel];
    const mask = _.filter(this.masks, ([key, binaryMask, colorMask]) => {
      return key === superpixel;
    });

    this.currentMask = mask[0][3] as ImageJS.Image;

    if (!this.currentMask || !this.currentData) return;

    const colorData = mask[0][2] as Int32Array;

    this.currentData = this.addImages(colorData, this.currentData);
    this.currentMask = new ImageJS.Image(
      this.image.width,
      this.image.height,
      this.currentData
    );
  }

  onMouseUp(position: { x: number; y: number }) {}

  private colorSuperpixelMap(mask: ImageJS.Image, color: string) {
    // const r = parseInt(color.slice(1, 3), 16);
    // const g = parseInt(color.slice(3, 5), 16);
    // const b = parseInt(color.slice(5, 7), 16);
    // const fillColor = [r, g, b, 150];
    const fillColor = [0, 255, 0, 150];

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
        return Math.min(el + bar[i], 255); // color should not be more than 255
      }
    });
  }

  static setup(image: ImageJS.Image) {
    const instance = new QuickSelectionOperator(image);

    const { count, map, superpixels } = instance.filter();

    instance.map = map;

    instance.superpixels = superpixels;

    const unique = _.uniq(superpixels);

    const masks = unique.map((superpixel) => {
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

      const [colorData, colorMask] = instance.colorSuperpixelMap(
        binaryImage,
        "green"
      );

      return [superpixel, binaryData, colorData, colorMask];
    });

    instance.masks = masks;

    return instance;
  }
}
