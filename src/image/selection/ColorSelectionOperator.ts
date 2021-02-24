import { SelectionOperator } from "./SelectionOperator";
import { makeFloodMap } from "../flood";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { isoLines } from "marchingsquares";
import { encode } from "../rle";

export class ColorSelectionOperator extends SelectionOperator {
  roiContour?: ImageJS.Image;
  roiMask?: ImageJS.Image;
  offset?: { x: number; y: number };
  overlayData: string = "";
  points: Array<number> = [];
  initialPosition: { x: number; y: number } = { x: 0, y: 0 };
  tolerance: number = 1;
  toleranceMap?: ImageJS.Image;

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.points) return undefined;

    const pairs = _.chunk(this.points, 2);

    return [
      Math.round(_.min(_.map(pairs, _.first))!),
      Math.round(_.min(_.map(pairs, _.last))!),
      Math.round(_.max(_.map(pairs, _.first))!),
      Math.round(_.max(_.map(pairs, _.last))!),
    ];
  }

  get contour() {
    return this.points;
  }

  get mask(): Array<number> | undefined {
    if (!this.roiMask) return;

    // @ts-ignore
    return encode(this.roiMask.data as Uint8Array);
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.overlayData = "";

    this.roiMask = undefined;
    this.roiContour = undefined;

    this.points = [];

    this.initialPosition = { x: 0, y: 0 };

    this.tolerance = 1;
    this.toleranceMap = undefined;
  }

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
    if (!this.roiContour || !this.roiMask) return;

    const greyData = _.chunk(this.roiContour.getRGBAData(), 4).map((chunk) => {
      if (chunk[0] === 255) {
        return 255;
      } else return 0;
    });
    // @ts-ignore
    const foo = ImageJS.Image.createFrom(this.roiMask, {
      bitDepth: 8,
      data: greyData,
    });
    // @ts-ignore
    const maskData = foo.getMatrix().data;

    const bar = maskData.map((el: Array<number>) => {
      return Array.from(el);
    });
    const polygons: Array<Array<number>>[] = isoLines(bar, 1);

    polygons.sort((a: Array<Array<number>>, b: Array<Array<number>>) => {
      return b.length - a.length;
    });

    // @ts-ignore
    const offsetX = this.roiMask.position[0];
    // @ts-ignore
    const offsetY = this.roiMask.position[1];

    this.points = _.flatten(
      polygons[0].map((coord) => {
        return [Math.round(coord[0] + offsetX), Math.round(coord[1] + offsetY)];
      })
    );

    this.selected = true;
    this.selecting = false;
  }

  private colorOverlay(
    mask: ImageJS.Image,
    position: { x: number; y: number },
    color: string
  ) {
    const r = parseInt(color.state(1, 3), 16);
    const g = parseInt(color.state(3, 5), 16);
    const b = parseInt(color.state(5, 7), 16);
    const fillColor = [r, g, b, 150];

    let overlay = new ImageJS.Image(
      mask.width,
      mask.height,
      new Uint8Array(mask.width * mask.height * 4),
      { alpha: 1 }
    );

    // roiPaint doesn't respect alpha, so we'll paint it ourselves.
    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        if (mask.getBitXY(x, y)) {
          overlay.setPixelXY(x, y, fillColor);
        }
      }
    }

    // Set the origin point to white, for visibility.
    overlay.setPixelXY(position.x, position.y, [255, 255, 255, 255]);

    return overlay.toDataURL();
  }

  private fromFlood = ({
    x,
    y,
    image,
    tolerance,
  }: {
    x: number;
    y: number;
    image: ImageJS.Image;
    tolerance: number;
  }) => {
    let overlay = new ImageJS.Image(
      image.width,
      image.height,
      new Uint8ClampedArray(image.width * image.height * 4),
      { alpha: 1 }
    );
    let roi = overlay.getRoiManager();

    // Use the watershed function with a single seed to determine the selected region.
    // @ts-ignore
    roi.fromWaterShed({
      image: image,
      fillMaxValue: tolerance,
      points: [[x, y]],
    });
    return roi;
  };

  private updateOverlay(position: { x: number; y: number }) {
    const roi = this.fromFlood({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      image: this.toleranceMap!,
      tolerance: this.tolerance,
    });

    // @ts-ignore
    this.roiMask = roi.getMasks()[0];
    // @ts-ignore
    this.roiContour = roi.getMasks({ kind: "contour" })[0];

    if (!this.roiMask) return;

    // @ts-ignore
    this.offset = { x: this.roiMask.position[0], y: this.roiMask.position[1] };

    this.overlayData = this.colorOverlay(this.roiMask, position, "red");
  }
}
