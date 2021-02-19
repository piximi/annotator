import { SelectionOperator } from "./SelectionOperator";
import { SuperpixelArray } from "../../types/SuperpixelArray";
import { slic } from "../slic";
import * as ImageJS from "image-js";
import * as _ from "lodash";

export class QuickSelectionOperator extends SelectionOperator {
  superpixels?: SuperpixelArray;
  superpixelData: string = "";
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

    // let superpixels: SuperpixelArray = {};
    //
    // for (let index = 0; index < segmentation.length; index += 1) {
    //   const current = segmentation[index];
    //
    //   if (!superpixels.hasOwnProperty(current)) {
    //     superpixels[current] = {
    //       count: 0,
    //       mask: {
    //         background: 0,
    //         foreground: 0,
    //       },
    //       mp: [0, 0, 0],
    //       role: {
    //         background: false,
    //         background_and_foreground: false,
    //         foreground: false,
    //         unknown: false,
    //       },
    //     };
    //   }
    //
    //   superpixels[current].count += 1;
    //   superpixels[current].mp[0] += data[4 * index];
    //   superpixels[current].mp[1] += data[4 * index + 1];
    //   superpixels[current].mp[2] += data[4 * index + 2];
    // }
    //
    // for (const superpixel in superpixels) {
    //   superpixels[superpixel].mp[0] /= superpixels[superpixel].count;
    //   superpixels[superpixel].mp[1] /= superpixels[superpixel].count;
    //   superpixels[superpixel].mp[2] /= superpixels[superpixel].count;
    // }
    //
    // Object.values(superpixels).forEach((superpixel) => {
    //   if (superpixel.mask.foreground > 0 && superpixel.mask.background === 0) {
    //     superpixel.role.foreground = true;
    //   } else if (
    //     superpixel.mask.foreground === 0 &&
    //     superpixel.mask.background > 0
    //   ) {
    //     superpixel.role.background = true;
    //   } else if (
    //     superpixel.mask.foreground > 0 &&
    //     superpixel.mask.background > 0
    //   ) {
    //     superpixel.role.background_and_foreground = true;
    //   } else {
    //     superpixel.role.unknown = true;
    //   }
    // });
    //
    // for (let index = 0; index < segmentation.length; index += 1) {
    //   if (superpixels[segmentation[index]].role.foreground) {
    //     data[4 * index] = data[4 * index];
    //     data[4 * index + 1] = data[4 * index + 1];
    //     data[4 * index + 2] = data[4 * index + 2];
    //     data[4 * index + 3] = 255;
    //   } else {
    //     data[4 * index + 3] = 0;
    //   }
    // }
    //
    // let superpixel;
    //
    // for (let index = 0; index < segmentation.length; ++index) {
    //   superpixel = superpixels[segmentation[index]];
    //
    //   data[4 * index + 3] = 255;
    //
    //   if (segmentation[index] === segmentation[index + 1]) {
    //     data[4 * index] = superpixel.mp[0];
    //     data[4 * index + 1] = superpixel.mp[1];
    //     data[4 * index + 2] = superpixel.mp[2];
    //   } else {
    //     data[4 * index] = 0;
    //     data[4 * index + 1] = 0;
    //     data[4 * index + 2] = 0;
    //   }
    // }

    return { count, map, superpixels };
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (!this.superpixels) {
      const { count, map, superpixels } = this.filter();

      const pixel =
        superpixels[
          Math.round(position.x) + Math.round(position.y) * this.image.width
        ];

      const mask = superpixels.map((x: number) => {
        if (x === pixel) {
          return 255;
        } else {
          return 0;
        }
      });

      const foo = new ImageJS.Image(512, 512, mask, {
        alpha: 0,
        components: 1,
      });

      debugger;

      this.map = map;

      // this.superpixels = superpixels;
    }

    // if (!this.map) return;
    //
    // const r = this.map[pixel];
    // const g = this.map[pixel + 1];
    // const b = this.map[pixel + 2];
    //
    // const superpixelMask = _.flatten(
    //   _.chunk(this.map, 4).map(([red, green, blue, alpha]: Array<number>) => {
    //     if (r === red && g === green && b === blue) {
    //       return [255, 255, 255, 255];
    //     } else {
    //       return [0, 0, 0, 255];
    //     }
    //   })
    // );
    //
    // const superpixel = new ImageJS.Image(
    //   this.image.width,
    //   this.image.height,
    //   superpixelMask,
    //   { components: 3 }
    // );
    //
    // // this.superpixelData = this.colorSuperpixelMap(superpixel, "green");
    //
    // this.selecting = true;
  }

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  private colorSuperpixelMap(mask: ImageJS.Image, color: string) {
    // const r = parseInt(color.slice(1, 3), 16);
    // const g = parseInt(color.slice(3, 5), 16);
    // const b = parseInt(color.slice(5, 7), 16);
    // const fillColor = [r, g, b, 150];
    const fillColor = [0, 255, 0, 150];

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
        }
      }
    }

    return overlay.toDataURL();
  }
}
