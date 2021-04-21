import { AnnotationTool } from "../AnnotationTool";
import { slic } from "../../../slic";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { encode } from "../../../rle";

export class QuickAnnotationTool extends AnnotationTool {
  colorMasks?: Array<string>;
  currentSuperpixel?: number;
  superpixels?: Int32Array;
  currentMask?: ImageJS.Image;
  map?: Uint8Array | Uint8ClampedArray;
  masks?: { [key: number]: ImageJS.Image };

  flatPixelCoordinate(position: { x: number; y: number }) {
    return Math.round(position.x) + Math.round(position.y) * this.image.width;
  }

  computeQuickSelectionMask(): Array<number> | undefined {
    if (!this.currentMask) return;

    return encode(this.currentMask.grey().data as Uint8Array);
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

    this.colorMasks = undefined;
    this.currentSuperpixel = undefined;
    this.currentMask = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.superpixels || !this.masks) return;

    const pixel = this.flatPixelCoordinate(position);

    this.currentSuperpixel = this.superpixels[pixel];

    this.currentMask = this.masks[this.currentSuperpixel];

    this.annotating = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.superpixels || !this.masks) return;

    const pixel = this.flatPixelCoordinate(position);

    const superpixel = this.superpixels[pixel];

    if (superpixel === this.currentSuperpixel) return; // don't draw superpixel mask if already on that superpixel

    this.currentSuperpixel = superpixel;

    const prevMask = this.currentMask;

    this.currentMask = this.masks[superpixel];

    if (!this.annotating) return;

    if (!this.currentMask || !prevMask) return;

    this.currentMask = this.addImages(prevMask, this.currentMask);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (!this.currentMask) return;

    const pad = 1; //we pad here to be robust to the case where ROI is along a border of the image.
    // Otherwise the isoLine algorithm is going to return the wrong mask. We pad to not have any pixel on the border.

    //@ts-ignore
    const padded = this.currentMask.pad({
      size: pad,
      algorithm: "set",
      color: [0, 0, 0, 0],
    });

    const greyData = padded.grey();

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
    this._mask = this.computeQuickSelectionMask();
    this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

    this.annotated = true;
    this.annotating = false;
  }

  private static colorSuperpixelMap(mask: ImageJS.Image, color: string) {
    const fillColor = [255, 0, 0, 150];

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

    return overlay;
  }

  private addImages(foo: ImageJS.Image, bar: ImageJS.Image) {
    const fooData = foo.data;
    const barData = bar.data;

    const bazData = fooData.map((el: number, i: number) => {
      if ((i + 1) % 4 === 0) {
        // opacity should not be added
        return Math.max(el, barData[i]);
      } else {
        return Math.min(el + barData[i], 255); //FIXME this is going to be wrong for mixed colors (not just R, G or B)
      }
    });

    return new ImageJS.Image(this.image.width, this.image.height, bazData, {
      components: 3,
      alpha: 1,
    });
  }

  static setup(image: ImageJS.Image) {
    const instance = new QuickAnnotationTool(image);

    const { count, map, superpixels } = instance.filter();

    instance.map = map;

    instance.superpixels = superpixels;

    const unique = _.uniq(superpixels);

    const masks: { [key: number]: ImageJS.Image } = {};

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

      masks[superpixel] = QuickAnnotationTool.colorSuperpixelMap(
        binaryImage,
        "green"
      );
    });

    instance.masks = masks;

    return instance;
  }
}
