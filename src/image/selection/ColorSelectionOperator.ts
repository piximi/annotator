import { SelectionOperator } from "./SelectionOperator";
import { floodPixels, makeFloodMap } from "../flood";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";

export class ColorSelectionOperator extends SelectionOperator {
  binaryMask?: ImageJS.Image;
  categoryColor?: string;
  overlayData: string = "";
  initialPosition: { x: number; y: number } = { x: 0, y: 0 };
  tolerance: number = 1;
  toleranceMap?: ImageJS.Image;

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour() {
    return [];
  }

  get mask(): string | undefined {
    if (!this.binaryMask) return;

    return this.binaryMask.toDataURL();
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    this.selected = false;
    this.selecting = true;
    this.tolerance = 1;
    this.initialPosition = position;
    this.toleranceMap = makeFloodMap({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      image: this.image!,
    });
    this.updateOverlay(position);
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selecting) {
      const diff = Math.ceil(
        Math.hypot(
          position.x - this.initialPosition!.x,
          position.y - this.initialPosition!.y
        )
      );
      if (diff !== this.tolerance) {
        this.tolerance = diff;
        this.updateOverlay(this.initialPosition);
      }
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    this.selected = true;
    this.selecting = false;
  }

  select(category: Category) {
    this.categoryColor = category.color;
  }

  private updateOverlay(position: { x: any; y: any }) {
    this.binaryMask = floodPixels({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      image: this.toleranceMap!,
      tolerance: this.tolerance,
    });

    if (!this.binaryMask) return;

    this.overlayData = this.colorOverlay(this.binaryMask, position, "red");
  }

  private colorOverlay(
    mask: ImageJS.Image,
    position: { x: number; y: number },
    color: string
  ) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const fillColor = [r, g, b, 150];

    let overlay = new ImageJS.Image(
      mask.width,
      mask.height,
      new Uint8ClampedArray(mask.width * mask.height * 4),
      { alpha: 1 }
    );

    // roiPaint doesn't respect alpha, so we'll paint it ourselves.
    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        if (mask.getBitXY(x, y)) {
          overlay.setPixelXY(
            x + mask.position[0],
            y + mask.position[1],
            fillColor
          );
        }
      }
    }

    // Set the origin point to white, for visibility.
    overlay.setPixelXY(position.x, position.y, [255, 255, 255, 255]);

    return overlay.toDataURL();
  }
}
