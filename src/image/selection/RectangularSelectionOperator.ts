import { SelectionOperator } from "./SelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import { slpf } from "../polygon-fill/slpf";

export class RectangularSelectionOperator extends SelectionOperator {
  origin?: { x: number; y: number };

  width?: number;
  height?: number;

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.width || !this.height) return undefined;

    return [
      this.origin.x,
      this.origin.y,
      this.origin.x + this.width,
      this.origin.y + this.height,
    ];
  }

  get mask(): string | undefined {
    const maskImage = new ImageJS.Image({
      width: this.image.width,
      height: this.image.height,
      bitDepth: 8,
    });

    if (!this.width || !this.height || !this.origin) return;

    const connectedPoints: Array<Array<number>> = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        connectedPoints.push([
          Math.floor(x + this.origin.x),
          Math.floor(y + this.origin.y),
        ]);
      }
    }

    slpf(connectedPoints, maskImage);

    return maskImage.toDataURL();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.origin = undefined;

    this.width = undefined;
    this.height = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    this.origin = position;

    this.selecting = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.resize(position);

    this.selected = true;
    this.selecting = false;
  }

  select(category: Category) {
    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      mask: this.mask,
    };
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.width = position.x - this.origin.x;
      this.height = position.y - this.origin.y;
    }
  }
}
