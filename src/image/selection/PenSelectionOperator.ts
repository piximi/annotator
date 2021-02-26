import { SelectionOperator } from "./SelectionOperator";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { connectPoints } from "../imageHelper";
import { decode, encode } from "../rle";

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
    const canvas = document.createElement("canvas");
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const connected = connectPoints(
      _.chunk(this.points, 2),
      new ImageJS.Image(this.image.width, this.image.height)
    );
    connected.forEach((position) => {
      ctx.beginPath();
      ctx.arc(
        Math.floor(position[0]),
        Math.floor(position[1]),
        5,
        0,
        Math.PI * 2,
        true
      ); //FIXME radius should determined by the tool
      ctx.fill();
    });

    const rgbMask = ImageJS.Image.fromCanvas(canvas);
    // @ts-ignore
    const binaryMask = rgbMask.getChannel(3); //returning opacity channel gives binary image
    return encode(binaryMask.data);
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
