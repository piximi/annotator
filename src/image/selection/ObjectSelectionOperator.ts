import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";
import * as _ from "lodash";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  graph?: tensorflow.LayersModel;
  prediction?: ImageJS.Image;
  points: Array<number> = [];
  roi?: ImageJS.Roi;
  offset?: { x: number; y: number };
  output?: ImageJS.Image;

  get boundingBox(): [number, number, number, number] | undefined {
    return [this.roi.minX, this.roi.minY, this.roi.maxX, this.roi.maxY];
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

  select(category: Category) {
    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      mask: this.mask,
    };
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

          const mask = this.output.grey().mask();
          const rois = this.manager.fromMask(mask).getRois();
          rois.sort((a: any, b: any) => b.surface - a.surface);
          this.roi = rois[0];

          if (!this.roi) return;

          const contour = this.roi.getMask({ kind: "contour" });

          const data = contour.getRGBAData();

          const boundary = _.flatten(
            _.chunk(data, 4).map((el, idx) => {
              if (el[0] === 0) {
                return [el[0], el[1], el[2], 0];
              } else {
                return el;
              }
            })
          );

          const boundaryArray = Uint8Array.from(boundary as number[]);
          const boundaryImage = new ImageJS.Image(
            contour.width,
            contour.height,
            boundaryArray
          );

          this.offset = {
            x: this.roi.minX,
            y: this.roi.minY,
          };

          this.prediction = boundaryImage;
        });
    }
  }
}
