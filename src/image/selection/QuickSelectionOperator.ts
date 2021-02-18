import { SelectionOperator } from "./SelectionOperator";
import { SuperpixelArray } from "../../types/SuperpixelArray";
import { slic } from "../slic";
import * as ImageJS from "image-js";

export class QuickSelectionOperator extends SelectionOperator {
  superpixels?: SuperpixelArray;

  // maps pixel position to superpixel index
  map?: Uint8Array | Uint8ClampedArray;

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
    map: Uint8Array | Uint8ClampedArray;
    superpixels: SuperpixelArray;
  } {
    const data = this.image.getRGBAData();

    const { map, segmentation } = slic(
      data,
      this.image.width,
      this.image.height
    );

    let superpixels: SuperpixelArray = {};

    for (let index = 0; index < segmentation.length; index += 1) {
      const current = segmentation[index];

      if (!superpixels.hasOwnProperty(current)) {
        superpixels[current] = {
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

      superpixels[current].count += 1;
      superpixels[current].mp[0] += data[4 * index];
      superpixels[current].mp[1] += data[4 * index + 1];
      superpixels[current].mp[2] += data[4 * index + 2];
    }

    for (const superpixel in superpixels) {
      superpixels[superpixel].mp[0] /= superpixels[superpixel].count;
      superpixels[superpixel].mp[1] /= superpixels[superpixel].count;
      superpixels[superpixel].mp[2] /= superpixels[superpixel].count;
    }

    Object.values(superpixels).forEach((superpixel) => {
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
      if (superpixels[segmentation[index]].role.foreground) {
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
      superpixel = superpixels[segmentation[index]];

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

    return { map, superpixels };
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (!this.superpixels) {
      const { map, superpixels } = this.filter();

      this.map = map;

      this.superpixels = superpixels;
    }

    const pixel = (position.x + position.y * this.image.width) * 4;

    if (!this.map) return;

    const index = this.map[pixel];

    const superpixelMask = this.map.map((element: number, j: number) => {
      if (element === index || (j + 1) % 4 === 0) {
        return 255;
      } else {
        return 0;
      }
    });

    const superpixel = new ImageJS.Image(
      this.image.width,
      this.image.height,
      superpixelMask
    );

    console.info(superpixel.toDataURL());

    debugger;

    this.selecting = true;
  }

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}
}
