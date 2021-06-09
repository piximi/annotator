import { AnnotationType } from "../../../../types/AnnotationType";
import * as ImageJS from "image-js";
import { CategoryType } from "../../../../types/CategoryType";
import * as _ from "lodash";
import { connectPoints, drawLine } from "../../../imageHelper";
import { simplify } from "../../../simplify/simplify";
import { slpf } from "../../../polygon-fill/slpf";
import * as uuid from "uuid";
import { decode, encode } from "../../../rle";
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
  protected _mask?: Array<number>;

  constructor(image: ImageJS.Image) {
    super(image);

    this.manager = image.getRoiManager();
  }

  /*
   * Method for add, subtract and intersect modes.
   * Draw a ROI mask in the coordinate space of the new combined bounding box.
   * */
  drawMaskInNewBoundingBox(
    newMaskImage: ImageJS.Image,
    maskImage: ImageJS.Image,
    boundingBox: [number, number, number, number],
    newBoundingBox: [number, number, number, number]
  ) {
    for (let x = 0; x < maskImage.width; x++) {
      for (let y = 0; y < maskImage.height; y++) {
        const pixel = maskImage.getPixelXY(x, y)[0];
        // if (x > boundingBox1[2] && pixel > 0) console.info("Not supposed to happen")
        if (pixel === 255) {
          newMaskImage.setPixelXY(
            x + boundingBox[0] - newBoundingBox[0],
            y + boundingBox[1] - newBoundingBox[1],
            [255]
          );
        }
      }
    }
    return newMaskImage;
  }

  /*
   * Adding to a Operator adds any new areas you select to your existing
   * Operator.
   */
  add(
    encodedMaskData1: Array<number>,
    boundingBox1: [number, number, number, number]
  ): [Array<number>, [number, number, number, number]] {
    if (!this._mask || !this._boundingBox) return [[], [0, 0, 0, 0]];

    const maskData1 = decode(encodedMaskData1);
    const maskData2 = decode(this._mask);
    const boundingBox2 = this._boundingBox;

    // const maskImage1 = new ImageJS.Image(
    //   boundingBox1[2] - boundingBox1[0],
    //   boundingBox1[3] - boundingBox1[1],
    //   maskData1,
    //   { components: 1, alpha: 0 }
    // );
    // const maskImage2 = new ImageJS.Image(
    //   boundingBox2[2] - boundingBox2[0],
    //   boundingBox2[3] - boundingBox2[1],
    //   maskData2,
    //   { components: 1, alpha: 0 }
    // );
    //
    const newBoundingBox = [
      boundingBox2[0] < boundingBox1[0] ? boundingBox2[0] : boundingBox1[0],
      boundingBox2[1] < boundingBox1[1] ? boundingBox2[1] : boundingBox1[1],
      boundingBox2[2] > boundingBox1[2] ? boundingBox2[2] : boundingBox1[2],
      boundingBox2[3] > boundingBox1[3] ? boundingBox2[3] : boundingBox1[3],
    ] as [number, number, number, number];
    //
    const newBoundingBoxWidth = newBoundingBox[2] - newBoundingBox[0];
    const newBoundingBoxHeight = newBoundingBox[3] - newBoundingBox[1];
    //
    // let translatedMaskImage = new ImageJS.Image(
    //   newBoundingBoxWidth,
    //   newBoundingBoxHeight,
    //   { components: 1, alpha: 0 }
    // );
    //
    // translatedMaskImage = this.drawMaskInNewBoundingBox(
    //   translatedMaskImage,
    //   maskImage1,
    //   boundingBox1,
    //   newBoundingBox
    // );
    // translatedMaskImage = this.drawMaskInNewBoundingBox(
    //   translatedMaskImage,
    //   maskImage2,
    //   boundingBox2,
    //   newBoundingBox
    // );

    const newMaskData = [];

    for (let i = 0; i < newBoundingBoxWidth * newBoundingBoxHeight; i++) {
      const x = i % newBoundingBoxWidth;
      const y = Math.floor(i / newBoundingBoxWidth);
      const x_img = x + newBoundingBox[0]; //translate from bounding box coordinates to image coords
      const y_img = y + newBoundingBox[1];
      const x_mask1 = x_img - boundingBox1[0]; //translate from image coords to mask coordinates
      const y_mask1 = y_img - boundingBox1[1];
      const x_mask2 = x_img - boundingBox2[0];
      const y_mask2 = y_img - boundingBox2[1];
      const i_mask1 = x_mask1 + y_mask1 * (boundingBox1[2] - boundingBox1[0]); //flattened index for mask1
      const i_mask2 = x_mask2 + y_mask2 * (boundingBox2[2] - boundingBox2[0]); //flattened index for mask2
      if (maskData1[i_mask1] === 255 || maskData2[i_mask2] === 255) {
        newMaskData.push(255);
      } else {
        newMaskData.push(0);
      }
    }

    // return [encode(Uint8Array.from(translatedMaskImage.data)), newBoundingBox];
    return [encode(Uint8Array.from(newMaskData)), newBoundingBox];
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

    this._boundingBox = this.computeBoundingBoxFromContours(this.buffer);

    this.points = this.buffer;

    const maskImage = this.computeMask().crop({
      x: this._boundingBox[0],
      y: this._boundingBox[1],
      width: this._boundingBox[2] - this._boundingBox[0],
      height: this._boundingBox[3] - this._boundingBox[1],
    });

    this._mask = encode(maskImage.data);

    console.error(maskImage.toDataURL());

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
  intersect(
    selectedMask: Array<number>,
    selectedBoundingBox: [number, number, number, number]
  ): [Array<number>, [number, number, number, number]] {
    if (!this._mask || !this._boundingBox) return [[], [0, 0, 0, 0]];

    const selectedMaskData = decode(selectedMask);
    const maskData = decode(this._mask);

    const data = maskData.map((currentValue: number, index: number) => {
      if (currentValue === 255 && selectedMaskData[index] === 255) {
        return 255;
      } else return 0;
    });

    const combinedBoundingBox = [
      this._boundingBox[0] > selectedBoundingBox[0]
        ? this._boundingBox[0]
        : selectedBoundingBox[0],
      this._boundingBox[1] > selectedBoundingBox[1]
        ? this._boundingBox[1]
        : selectedBoundingBox[1],
      this._boundingBox[2] < selectedBoundingBox[2]
        ? this._boundingBox[2]
        : selectedBoundingBox[2],
      this._boundingBox[3] < selectedBoundingBox[3]
        ? this._boundingBox[3]
        : selectedBoundingBox[3],
    ] as [number, number, number, number];

    return [encode(data), combinedBoundingBox];
  }

  /*
   * Invert selected mask and compute inverted bounding box coordinates
   * */
  invert(
    selectedMask: Array<number>
  ): [Array<number>, [number, number, number, number]] {
    const mask = Array.from(decode(selectedMask));

    const imageWidth = this.image.width;
    const imageHeight = this.image.height;

    //find min and max boundary points when computing the mask
    const boundingbox: [number, number, number, number] = [
      imageWidth,
      imageHeight,
      0,
      0,
    ];

    mask.forEach((currentValue: number, index: number) => {
      if (currentValue === 255) {
        mask[index] = 0;
      } else {
        mask[index] = 255;
        const x = index % imageWidth;
        const y = Math.floor(index / imageWidth);
        if (x < boundingbox[0]) {
          boundingbox[0] = x;
        } else if (x > boundingbox[2]) {
          boundingbox[2] = x;
        }
        if (y < boundingbox[1]) {
          boundingbox[1] = y;
        } else if (y > boundingbox[3]) {
        }
        boundingbox[3] = y;
      }
    });

    const invertedmask = encode(Uint8Array.from(mask));

    return [invertedmask, boundingbox];
  }

  /*
   * Subtracting from a Operator deselects the areas you draw over, keeping
   * the rest of your existing Operator.
   */
  subtract(
    encodedMaskData1: Array<number>,
    boundingBox1: [number, number, number, number]
  ): [Array<number>, [number, number, number, number]] {
    if (!this._mask || !this._boundingBox) return [[], [0, 0, 0, 0]];

    const maskData1 = decode(encodedMaskData1);
    const maskData2 = decode(this._mask);

    const boundingBox2 = this._boundingBox;

    const newBoundingBox = [
      boundingBox2[2] > boundingBox1[0] &&
      boundingBox2[0] < boundingBox1[0] &&
      boundingBox2[1] < boundingBox1[1] &&
      boundingBox2[3] > boundingBox1[3]
        ? boundingBox2[2]
        : boundingBox1[0],
      boundingBox2[3] > boundingBox1[1] &&
      boundingBox2[1] < boundingBox1[1] &&
      boundingBox2[0] < boundingBox1[0] &&
      boundingBox2[2] > boundingBox1[2]
        ? boundingBox2[3]
        : boundingBox1[1],
      boundingBox2[0] < boundingBox1[2] &&
      boundingBox2[2] > boundingBox1[2] &&
      boundingBox2[1] < boundingBox1[1] &&
      boundingBox2[3] > boundingBox1[3]
        ? boundingBox2[0]
        : boundingBox1[2],
      boundingBox2[1] < boundingBox1[3] &&
      boundingBox2[3] > boundingBox1[3] &&
      boundingBox2[0] < boundingBox1[0] &&
      boundingBox2[2] > boundingBox1[2]
        ? boundingBox2[1]
        : boundingBox1[3],
    ] as [number, number, number, number];

    const newBoundingBoxWidth = newBoundingBox[2] - newBoundingBox[0];
    const newBoundingBoxHeight = newBoundingBox[3] - newBoundingBox[1];

    const newMaskData = [];

    for (let x = 0; x < newBoundingBoxWidth; x++) {
      for (let y = 0; y < newBoundingBoxHeight; y++) {
        const x_img = x + newBoundingBox[0]; //translate from bounding box coordinates to image coords
        const y_img = y + newBoundingBox[1];
        const x_mask1 = x_img - boundingBox1[0]; //translate from image coords to mask coordinates
        const y_mask1 = y_img - boundingBox1[1];
        const x_mask2 = x_img - boundingBox2[0];
        const y_mask2 = y_img - boundingBox2[1];
        const i_mask1 = x_mask1 + y_mask1 * (boundingBox1[2] - boundingBox1[0]); //flattened index for mask1
        const i_mask2 = x_mask2 + y_mask2 * (boundingBox2[2] - boundingBox2[0]); //flattened index for mask2
        if (maskData1[i_mask1] === 255 && maskData2[i_mask2] === 255) {
          newMaskData.push(255);
        } else {
          newMaskData.push(0);
        }
      }
    }

    return [encode(Uint8Array.from(newMaskData)), newBoundingBox];
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
    return maskImage.getChannel(0);
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
