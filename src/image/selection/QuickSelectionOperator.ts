import { SelectionOperator } from "./SelectionOperator";
import { SuperpixelArray } from "../../types/SuperpixelArray";
import { slic } from "../slic";

export class QuickSelectionOperator extends SelectionOperator {
  private _superpixels: SuperpixelArray = {};

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour() {
    return [];
  }

  get mask(): string | undefined {
    return undefined;
  }

  get superpixels(): SuperpixelArray | undefined {
    if (this._superpixels) return this._superpixels;

    const data = this.image.getRGBAData();

    const { image, segmentation } = slic(
      data,
      this.image.width,
      this.image.height
    );

    let superpixelArray: SuperpixelArray = {};

    for (let index = 0; index < segmentation.length; index += 1) {
      const current = segmentation[index];

      if (!superpixelArray.hasOwnProperty(current)) {
        superpixelArray[current] = {
          count: 0,
          mask: {
            background: 0,
            foreground: 0,
          },
          mp: [0, 0, 0],
          role: {
            background: false,
            background_and_foreground: false,
            foreground: false,
            unknown: false,
          },
        };
      }

      superpixelArray[current].count += 1;
      superpixelArray[current].mp[0] += data[4 * index];
      superpixelArray[current].mp[1] += data[4 * index + 1];
      superpixelArray[current].mp[2] += data[4 * index + 2];
    }

    for (const superpixel in superpixelArray) {
      superpixelArray[superpixel].mp[0] /= superpixelArray[superpixel].count;
      superpixelArray[superpixel].mp[1] /= superpixelArray[superpixel].count;
      superpixelArray[superpixel].mp[2] /= superpixelArray[superpixel].count;
    }

    Object.values(superpixelArray).forEach((superpixel) => {
      if (superpixel.mask.foreground > 0 && superpixel.mask.background === 0) {
        superpixel.role.foreground = true;
      } else if (
        superpixel.mask.foreground === 0 &&
        superpixel.mask.background > 0
      ) {
        superpixel.role.background = true;
      } else if (
        superpixel.mask.foreground > 0 &&
        superpixel.mask.background > 0
      ) {
        superpixel.role.background_and_foreground = true;
      } else {
        superpixel.role.unknown = true;
      }
    });

    for (let index = 0; index < segmentation.length; index += 1) {
      if (superpixelArray[segmentation[index]].role.foreground) {
        data[4 * index] = data[4 * index];
        data[4 * index + 1] = data[4 * index + 1];
        data[4 * index + 2] = data[4 * index + 2];
        data[4 * index + 3] = 255;
      } else {
        data[4 * index + 3] = 0;
      }
    }

    let superpixel;

    for (let index = 0; index < segmentation.length; ++index) {
      superpixel = superpixelArray[segmentation[index]];

      data[4 * index + 3] = 255;

      if (segmentation[index] === segmentation[index + 1]) {
        data[4 * index] = superpixel.mp[0];
        data[4 * index + 1] = superpixel.mp[1];
        data[4 * index + 2] = superpixel.mp[2];
      } else {
        data[4 * index] = 0;
        data[4 * index + 1] = 0;
        data[4 * index + 2] = 0;
      }
    }

    this._superpixels = superpixelArray;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}
}
