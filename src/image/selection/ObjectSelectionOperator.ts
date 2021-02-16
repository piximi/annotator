import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";
import * as _ from "lodash";
import { isoLines } from "marchingsquares";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  graph?: tensorflow.LayersModel;
  prediction?: ImageJS.Image;
  points: Array<number> = [];
  // @ts-ignore
  roi?: ImageJS.Roi;
  offset?: { x: number; y: number };
  output?: ImageJS.Image;

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

  get mask(): string | undefined {
    if (!this.output) return;
    return this.output.toDataURL();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.prediction = undefined;
    this.points = [];
    this.roi = undefined;
    this.offset = undefined;
    this.output = undefined;

    this.origin = undefined;
    this.width = undefined;
  }

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);

    this.predict();
  }

  static async compile(image: ImageJS.Image) {
    const instance = new ObjectSelectionOperator(image);

    const pathname =
      "https://raw.githubusercontent.com/zaidalyafeai/HostedModels/master/unet-128/model.json";

    instance.graph = await tensorflow.loadLayersModel(pathname);

    const optimizer = tensorflow.train.adam();

    instance.graph.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return instance;
  }

  private async predict() {
    if (!this.image || !this.origin || !this.width || !this.height) return;

    const width = Math.floor(this.width);
    const height = Math.floor(this.height);

    const crop = this.image.crop({
      x: this.origin.x,
      y: this.origin.y,
      width: width,
      height: height,
    });

    const prediction = tensorflow.tidy(() => {
      if (crop) {
        const cropped: tensorflow.Tensor3D = tensorflow.browser.fromPixels(
          crop.getCanvas()
        );

        const size: [number, number] = [128, 128];
        const resized = tensorflow.image.resizeBilinear(cropped, size);
        const standardized = resized.div(tensorflow.scalar(255));
        const batch = standardized.expandDims(0);

        if (this.graph) {
          const prediction = this.graph.predict(
            batch
          ) as tensorflow.Tensor<tensorflow.Rank>;

          return prediction
            .squeeze([0])
            .tile([1, 1, 3])
            .sub(0.3)
            .sign()
            .relu()
            .resizeBilinear([height, width])
            .pad([
              [this.origin!.y, this.image.height - (this.origin!.y + height)],
              [this.origin!.x, this.image.width - (this.origin!.x + width)],
              [0, 0],
            ]);
        }
      }
    });

    if (prediction) {
      tensorflow.browser
        .toPixels(prediction as tensorflow.Tensor3D)
        .then(async (clamped) => {
          this.output = new ImageJS.Image({
            width: this.image.width,
            height: this.image.height,
            data: clamped,
          });

          // @ts-ignore
          const data = this.output.grey().getMatrix().data;
          const bar = data.map((el: Array<number>) => {
            return Array.from(el);
          });
          const polygons = isoLines(bar, 1);

          polygons.sort((a: Array<number>, b: Array<number>) => {
            if (a.length < b.length) {
              return -1;
            }

            if (a.length > b.length) {
              return 1;
            }

            return 0;
          });
          const largest = polygons[polygons.length - 1];
          const foo: Array<number> = _.flatten(largest);
          this.points = foo.map((el: number) => {
            return Math.round(el);
          });
        });
    }
  }
}
