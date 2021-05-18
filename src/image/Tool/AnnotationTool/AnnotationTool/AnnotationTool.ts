import { AnnotationType } from "../../../../types/AnnotationType";
import * as ImageJS from "image-js";
import { CategoryType } from "../../../../types/CategoryType";
import * as _ from "lodash";
import { computeContours, connectPoints, drawLine } from "../../../imageHelper";
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

  protected _boundingBox?: [number, number, number, number];
  protected _contour?: Array<number>;
  protected _mask?: Array<number>;

  constructor(image: ImageJS.Image) {
    super(image);

    this.manager = image.getRoiManager();
  }

  /*
   * Adding to a Operator adds any new areas you select to your existing
   * Operator.
   */
  add(
    selectedMask: Array<number>,
    selectedBoundingBox: [number, number, number, number]
  ): [Array<number>, [number, number, number, number]] {
    if (!this._mask || !this._boundingBox) return [[], [0, 0, 0, 0]];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 || selectedMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    const combinedBoundingBox = [
      this._boundingBox[0] < selectedBoundingBox[0]
        ? this._boundingBox[0]
        : selectedBoundingBox[0],
      this._boundingBox[1] < selectedBoundingBox[1]
        ? this._boundingBox[1]
        : selectedBoundingBox[1],
      this._boundingBox[2] > selectedBoundingBox[2]
        ? this._boundingBox[2]
        : selectedBoundingBox[2],
      this._boundingBox[3] > selectedBoundingBox[3]
        ? this._boundingBox[3]
        : selectedBoundingBox[3],
    ] as [number, number, number, number];

    return [encode(data), combinedBoundingBox];
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

    this._contour = this.buffer;
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
  intersect(selectedMask: Array<number>): Array<number> {
    if (!this._mask) return [];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && selectedMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    return encode(data);
  }

  /*
   * Subtracting from a Operator deselects the areas you draw over, keeping
   * the rest of your existing Operator.
   */
  subtract(
    selectedMask: Array<number>,
    selectedBoundingBox: [number, number, number, number]
  ): [Array<number>, [number, number, number, number]] {
    if (!this._mask || !this._boundingBox) return [[], [0, 0, 0, 0]];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && selectedMaskData[index] === 255) {
        return 0;
      } else return selectedMaskData[index];
    });

    console.info(selectedBoundingBox);
    console.info(this._boundingBox);

    //FIXME this is the wrong logic
    const combinedBoundingBox = [
      this._boundingBox[0] > selectedBoundingBox[0]
        ? this._boundingBox[2]
        : selectedBoundingBox[0],
      this._boundingBox[3] > selectedBoundingBox[1]
        ? selectedBoundingBox[1]
        : this._boundingBox[3],
      this._boundingBox[0] > selectedBoundingBox[2]
        ? this._boundingBox[0]
        : selectedBoundingBox[2],
      this._boundingBox[1] > selectedBoundingBox[3]
        ? this._boundingBox[1]
        : selectedBoundingBox[3],
    ] as [number, number, number, number];

    console.info(combinedBoundingBox);
    return [encode(data), combinedBoundingBox];
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

  annotate(category: CategoryType): void {
    if (!this.boundingBox || !this.mask) return;

    this.annotation = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      id: uuid.v4(),
      mask: this.mask,
    };
  }
}
