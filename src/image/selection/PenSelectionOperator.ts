import { SelectionOperator } from "./SelectionOperator";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { encode } from "../rle";

export class PenSelectionOperator extends SelectionOperator {
  brushSize: number = 8;
  buffer: Array<number> = [];
  points: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour(): Array<number> | undefined {
    return undefined;
  }

  get mask(): Array<number> | undefined {
    const mask = new ImageJS.Image(this.image.width, this.image.height, {
      components: 1,
    });

    _.chunk(this.points, 2).forEach((position) => {
      mask.setPixelXY(position[0], position[1], [255]);
    });

    debugger;

    return [];
    // return encode(mask.data);
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    this.selecting = true;

    this.buffer = [...this.buffer, position.x, position.y];
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.buffer = [...this.buffer, position.x, position.y];
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.selected = true;

    this.selecting = false;

    this.points = this.buffer;

    console.info(this.mask);
  }
}
