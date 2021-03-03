import { Selection } from "../../types/Selection";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";
import * as _ from "lodash";
import { connectPoints } from "../imageHelper";
import { simplify } from "../simplify/simplify";
import { slpf } from "../polygon-fill/slpf";
import * as uuid from "uuid";
import { decode, encode } from "../rle";
import { isoLines } from "marchingsquares";

export abstract class SelectionOperator {
  image: ImageJS.Image;
  manager: ImageJS.RoiManager;
  points?: Array<number> = [];
  selected: boolean = false;
  selecting: boolean = false;
  selection?: Selection;

  protected _contour?: Array<number>;
  protected _mask?: Array<number>;

  constructor(image: ImageJS.Image) {
    this.image = image;

    this.manager = image.getRoiManager();
  }

  add(oldMask: Array<number>): [Array<number>, Array<number>] {
    if (!this._mask) return [[], []];

    const oldMaskData = decode(oldMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 || oldMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    const mat = _.chunk(data, this.image.width).map((el: Array<number>) => {
      return Array.from(el);
    });

    const contours = this.computeContours(mat);

    return [encode(data), _.flatten(contours)];
  }

  subtract(oldMask: Array<number>): [Array<number>, Array<number>] {
    if (!this._mask) return [[], []];

    const oldMaskData = decode(oldMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && oldMaskData[index] === 255) {
        return 0;
      } else return oldMaskData[index];
    });

    const mat = _.chunk(data, this.image.width).map((el: Array<number>) => {
      return Array.from(el);
    });
    const contours = this.computeContours(mat);

    return [encode(data), _.flatten(contours)];
  }

  abstract get boundingBox(): [number, number, number, number] | undefined;

  computeContours(data: Array<Array<number>>) {
    return isoLines(data, 1).sort((a: Array<number>, b: Array<number>) => {
      return b.length - a.length;
    })[0];
  }

  computeMask() {
    const maskImage = new ImageJS.Image({
      width: this.image.width,
      height: this.image.height,
      bitDepth: 8,
    });

    const coords = _.chunk(this.points, 2);

    const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
    simplify(connectedPoints, 1, true);
    slpf(connectedPoints, maskImage);

    //@ts-ignore
    return encode(maskImage.getChannel(0).data);
  }

  get contour(): Array<number> | undefined {
    return this._contour;
  }

  set contour(updatedContours: Array<number> | undefined) {
    this._contour = updatedContours;
  }

  get mask(): Array<number> | undefined {
    return this._mask;
  }

  set mask(updatedMask: Array<number> | undefined) {
    this._mask = updatedMask;
  }

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  select(category: Category): void {
    if (!this.boundingBox || !this.contour || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      contour: this.contour,
      id: uuid.v4(),
      mask: this.mask,
    };
  }
}
