import { AnnotationTool } from "../AnnotationTool";
import { slic } from "../../../slic";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { encode } from "../../../rle";
import { computeContours } from "../../../imageHelper";

export class QuickAnnotationTool extends AnnotationTool {
  brushsize?: number;
  colorMasks?: Array<string>;
  currentSuperpixels: Set<number> = new Set<number>();
  lastSuperpixel: number = 0;
  superpixels?: Int32Array;
  superpixelsMap?: { [key: number]: Array<number> };
  currentMask?: ImageJS.Image;
  map?: Uint8Array | Uint8ClampedArray;

  flatPixelCoordinate(position: { x: number; y: number }) {
    return Math.round(position.x) + Math.round(position.y) * this.image.width;
  }

  computeQuickSelectionMask(): Array<number> | undefined {
    if (!this.currentMask) return;

    return encode(this.currentMask.grey().data as Uint8Array);
  }

  filter(): {
    superpixels: Int32Array;
  } {
    const data = this.image.getRGBAData();

    const { count, map, superpixels } = slic(
      data,
      this.image.width,
      this.image.height,
      this.brushsize
    );

    return { superpixels };
  }

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.colorMasks = undefined;
    this.currentSuperpixels.clear();
    this.lastSuperpixel = 0;
    this.currentMask = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (!this.currentMask) {
      this.currentMask = new ImageJS.Image(
        this.image.width,
        this.image.height,
        new Uint8Array(this.image.width * this.image.height * 4),
        { alpha: 1 }
      );
    }

    if (!this.superpixels) return;

    this.annotating = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.superpixels) return;

    const pixel = this.flatPixelCoordinate(position);

    const superpixel = this.superpixels[pixel];

    if (this.currentSuperpixels.has(superpixel)) return; // don't draw superpixel mask if already on that superpixel

    this.lastSuperpixel = superpixel;

    if (!this.annotating) {
      this.currentSuperpixels.clear();

      this.currentMask = new ImageJS.Image(
        this.image.width,
        this.image.height,
        new Uint8Array(this.image.width * this.image.height * 4),
        { alpha: 1 }
      );
    }

    this.currentSuperpixels.add(superpixel);

    this.superpixelsMap![superpixel].forEach((index: number) => {
      this.currentMask!.setPixel(index, [255, 0, 0, 150]);
    });
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

    this._contour = computeContours(bar);
    this._mask = this.computeQuickSelectionMask();
    this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

    this.annotated = true;
    this.annotating = false;
  }

  static setup(image: ImageJS.Image, brushsize: number) {
    const instance = new QuickAnnotationTool(image);

    instance.update(brushsize);

    return instance;
  }

  update(brushsize: number) {
    this.brushsize = Math.round(brushsize);

    const { superpixels } = this.filter();

    this.superpixels = superpixels;

    this.superpixelsMap = {};

    superpixels.forEach((pixel: number, index: number) => {
      if (!(pixel in this.superpixelsMap!)) {
        this.superpixelsMap![pixel] = [];
      }
      this.superpixelsMap![pixel].push(index);
    });
  }
}
