import { AnnotationTool } from "../AnnotationTool";
import { makeFloodMap } from "../../../flood";
import * as ImageJS from "image-js";
import * as _ from "lodash";
import { encode } from "../../../rle";

export class ColorAnnotationTool extends AnnotationTool {
  roiContour?: ImageJS.Image;
  roiMask?: ImageJS.Image;
  offset?: { x: number; y: number };
  overlayData: string = "";
  points: Array<number> = [];
  initialPosition: { x: number; y: number } = { x: 0, y: 0 };
  tolerance: number = 1;
  toleranceMap?: ImageJS.Image;
  toolTipPosition?: { x: number; y: number };

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.overlayData = "";

    this.roiMask = undefined;
    this.roiContour = undefined;

    this.points = [];

    this.initialPosition = { x: 0, y: 0 };
    this.toolTipPosition = undefined;

    this.tolerance = 1;
    this.toleranceMap = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (!this.stagedImageShape) return;

    this.annotated = false;
    this.annotating = true;
    this.tolerance = 1;
    this.initialPosition = position;
    this.toolTipPosition = position;

    const { x, y } = this.toImageSpace(position);

    this.toleranceMap = makeFloodMap({
      x,
      y,
      image: this.image!,
    });

    this.updateOverlay(position);
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.annotating) {
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
      this.toolTipPosition = position;
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

    const largest: Array<Array<number>> = this.computeContours(bar);

    if (!largest) return;

    // @ts-ignore
    const offsetX = this.roiMask.position[0];
    // @ts-ignore
    const offsetY = this.roiMask.position[1];

    this.points = _.flatten(
      largest.map((coord) => {
        return [Math.round(coord[0] + offsetX), Math.round(coord[1] + offsetY)];
      })
    );

    this._contour = this.points;
    this._boundingBox = this.computeBoundingBoxFromContours(this._contour);
    // @ts-ignore
    this._mask = encode(this.roiMask.data as Uint8Array);

    this.annotated = true;
    this.annotating = false;
  }

  private static colorOverlay(
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

    if (!this.stagedImageShape) return;

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
    const { x, y } = this.toImageSpace(position);

    const roi = this.fromFlood({
      x: x,
      y: y,
      image: this.toleranceMap!,
      tolerance: this.tolerance,
    });

    // @ts-ignore
    this.roiMask = roi.getMasks()[0];
    // @ts-ignore
    this.roiContour = roi.getMasks({ kind: "contour" })[0];

    if (!this.roiMask) return;

    // @ts-ignore
    this.offset = this.toStageSpace({
      // @ts-ignore
      x: this.roiMask.position[0],
      // @ts-ignore
      y: this.roiMask.position[1],
    });

    this.overlayData = ColorAnnotationTool.colorOverlay(
      this.roiMask,
      { x, y },
      "red"
    );
  }
}
