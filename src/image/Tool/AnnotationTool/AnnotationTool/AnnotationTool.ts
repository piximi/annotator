import { AnnotationType } from "../../../../types/AnnotationType";
import * as ImageJS from "image-js";
import { CategoryType } from "../../../../types/CategoryType";
import * as _ from "lodash";
import { connectPoints, drawLine } from "../../../imageHelper";
import { simplify } from "../../../simplify/simplify";
import { slpf } from "../../../polygon-fill/slpf";
import * as uuid from "uuid";
import { decode, encode } from "../../../rle";
import { isoLines } from "marchingsquares";
import { Tool } from "../../Tool";

export abstract class AnnotationTool extends Tool {
  manager: ImageJS.RoiManager;
  points?: Array<number> = [];
  annotated: boolean = false;
  annotating: boolean = false;
  annotation?: AnnotationType;

  anchor?: { x: number; y: number } = undefined;
  origin?: { x: number; y: number } = undefined;
  buffer?: Array<number> = [];

  stagedImageShape?: { width: number; height: number } = undefined;
  stagedImagePosition: { x: number; y: number } = { x: 0, y: 0 };

  protected _boundingBox?: [number, number, number, number];
  protected _contour?: Array<number>;
  protected _mask?: Array<number>;

  constructor(
    image: ImageJS.Image,
    stagedImagePosition: { x: number; y: number },
    stagedImageShape: { width: number; height: number }
  ) {
    super(image);

    this.manager = image.getRoiManager();
    this.stagedImageShape = stagedImageShape;
  }

  /*
   * Adding to a Operator adds any new areas you select to your existing
   * Operator.
   */
  add(selectedMask: Array<number>): [Array<number>, Array<number>] {
    if (!this._mask) return [[], []];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 || selectedMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    const mat = _.chunk(data, this.image.width).map((el: Array<number>) => {
      return Array.from(el);
    });

    const contours = this.computeContours(mat);

    return [encode(data), _.flatten(contours)];
  }

  connect() {
    if (this.annotated) return;

    if (!this.anchor || !this.origin) return;

    if (!this.buffer) return;

    const anchorIndex = _.findLastIndex(this.buffer, (point) => {
      return point === this.anchor!.x;
    });

    const segment = _.flatten(
      drawLine([this.anchor.x, this.anchor.y], [this.origin.x, this.origin.y])
    );

    this.buffer.splice(anchorIndex, segment.length, ...segment);

    this._contour = this.translateStagedPointsToImagePoints(this.buffer);
    this._mask = this.computeMask();
    this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

    this.anchor = undefined;
    this.origin = undefined;
    this.buffer = [];

    this.annotated = true;
    this.annotating = false;
  }

  /*
   * When using the Intersect Operator mode, any currently selected areas you
   * select over will be kept and any currently selected areas outside your
   * new Operator will be removed from the Operator.
   */
  intersect(selectedMask: Array<number>): [Array<number>, Array<number>] {
    if (!this._mask) return [[], []];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && selectedMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    const mat = _.chunk(data, this.image.width).map((el: Array<number>) => {
      return Array.from(el);
    });
    const contours = this.computeContours(mat);

    return [encode(data), _.flatten(contours)];
  }

  invert(mask: Array<number>, encoded = false): Array<number> {
    if (encoded) {
      mask = Array.from(decode(mask));
    }

    mask.forEach((currentValue: number, index: number) => {
      if (currentValue === 255) {
        mask[index] = 0;
      } else mask[index] = 255;
    });

    if (encoded) {
      mask = encode(Uint8Array.from(mask));
    }
    return mask;
  }

  invertContour(contour: Array<number>): Array<number> {
    //using https://jsbin.com/tevejujafi/3/edit?html,js,output and https://en.wikipedia.org/wiki/Nonzero-rule
    const frame = [0, 0, 512, 0, 512, 512, 0, 512, 0, 0];
    const counterClockWiseContours = _.flatten(_.reverse(_.chunk(contour, 2)));
    return _.concat(frame, counterClockWiseContours);
  }

  /*
   * Subtracting from a Operator deselects the areas you draw over, keeping
   * the rest of your existing Operator.
   */
  subtract(selectedMask: Array<number>): [Array<number>, Array<number>] {
    if (!this._mask) return [[], []];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && selectedMaskData[index] === 255) {
        return 0;
      } else return selectedMaskData[index];
    });

    const mat = _.chunk(data, this.image.width).map((el: Array<number>) => {
      return Array.from(el);
    });
    const contours = this.computeContours(mat);

    return [encode(data), _.flatten(contours)];
  }

  get boundingBox(): [number, number, number, number] | undefined {
    return this._boundingBox;
  }

  set boundingBox(
    updatedBoundingBox: [number, number, number, number] | undefined
  ) {
    this._boundingBox = updatedBoundingBox;
  }

  computeBoundingBoxFromContours(
    contour: Array<number>
  ): [number, number, number, number] {
    const pairs = _.chunk(contour, 2);

    return [
      Math.round(_.min(_.map(pairs, _.first))!),
      Math.round(_.min(_.map(pairs, _.last))!),
      Math.round(_.max(_.map(pairs, _.first))!),
      Math.round(_.max(_.map(pairs, _.last))!),
    ];
  }

  computeContours(data: Array<Array<number>>) {
    return isoLines(data, 1).sort((a: Array<number>, b: Array<number>) => {
      return b.length - a.length;
    })[0];
  }

  computeMask() {
    const maskImage = new ImageJS.Image({
      width: this.image.width,
      height: this.image.height,
      bitDepth: 8,
    });

    const coords = _.chunk(this.points, 2);

    const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
    simplify(connectedPoints, 1, true);
    slpf(connectedPoints, maskImage);

    //@ts-ignore
    return encode(maskImage.getChannel(0).data);
  }

  get contour(): Array<number> | undefined {
    return this._contour;
  }

  set contour(updatedContours: Array<number> | undefined) {
    this._contour = updatedContours;
  }

  get mask(): Array<number> | undefined {
    return this._mask;
  }

  set mask(updatedMask: Array<number> | undefined) {
    this._mask = updatedMask;
  }

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  /**
   * Convert the points in the staged image coordinates to actual image coordinates.
   */
  protected translateStagedPointsToImagePoints(points: Array<number>) {
    const stagedPoints = _.chunk(points, 2);
    return _.flatten(
      _.map(stagedPoints, (el: Array<number>) => {
        const imagePoints = this.toImageSpace({ x: el[0], y: el[1] });
        return [imagePoints.x, imagePoints.y];
      })
    );
  }

  /**
   * From coordinates in the staged image to coordinates in image space
   */
  protected toImageSpace(position: { x: number; y: number }) {
    if (!this.stagedImageShape) return position;

    const x_im = Math.floor(
      ((position.x - this.stagedImagePosition.x) /
        this.stagedImageShape.width) *
        this.image.width
    );
    const y_im = Math.floor(
      ((position.y - this.stagedImagePosition.y) /
        this.stagedImageShape.height) *
        this.image.height
    );

    return { x: x_im, y: y_im };
  }

  /**
   * From coordinates of the original image to the coordinates in the staged image
   */
  protected toStageSpace(position: { x: number; y: number }) {
    if (!this.stagedImageShape) return position;

    const x_stage = Math.floor(
      (position.x * this.stagedImageShape.width) / this.image.width +
        this.stagedImagePosition.x
    );
    const y_stage = Math.floor(
      (position.y * this.stagedImageShape.height) / this.image.height +
        this.stagedImagePosition.y
    );

    return { x: x_stage, y: y_stage };
  }

  annotate(category: CategoryType): void {
    if (!this.boundingBox || !this.contour || !this.mask) return;

    this.annotation = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      contour: this.contour,
      id: uuid.v4(),
      mask: this.mask,
    };
  }
}
