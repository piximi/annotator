import { SelectionOperator } from "./SelectionOperator";
import { floodPixels, makeFloodMap } from "../flood";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";
import * as _ from "lodash";
import { isoLines } from "marchingsquares";

export class ColorSelectionOperator extends SelectionOperator {
  binaryMask?: ImageJS.Image;
  categoryColor?: string;
  overlayData: string = "";
  points: Array<number> = [];
  initialPosition: { x: number; y: number } = { x: 0, y: 0 };
  tolerance: number = 1;
  toleranceMap?: ImageJS.Image;

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get contour() {
    if (!this.binaryMask) return;

    const greyData = _.chunk(this.binaryMask.getRGBAData(), 4).map((chunk) => {
      if (chunk[0] === 255) {
        return 255;
      } else return 0;
    });
    // @ts-ignore
    const maskData = ImageJS.Image.createFrom(this.binaryMask, {
      bitDepth: 8,
      data: greyData,
    }).getMatrix().data;

    const bar = maskData.map((el: Array<number>) => {
      return Array.from(el);
    });
    const polygons: Array<Array<number>> = isoLines(bar, 1);
    polygons.sort((a: Array<number>, b: Array<number>) => {
      return b.length - a.length;
    });

    this.points = _.flatten(polygons[0]).map((el: number) => {
      return Math.round(el);
    });

    return this.points;
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
    console.log(this.contour);
    debugger;
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

    // const mask = ImageJS.Image.createFrom(this.binaryMask, {bitDepth: 8, data: this.binaryMask.getRGBAData(), components: 3 });

    // @ts-ignore
    // const data = this.binaryMask.grey().getMatrix().data;

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
            // @ts-ignore
            x + mask.position[0],
            // @ts-ignore
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
