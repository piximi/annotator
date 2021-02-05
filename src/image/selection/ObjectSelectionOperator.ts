import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";
import { RoiManager } from "image-js";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  graph?: tensorflow.LayersModel;
  prediction?: ImageJS.Image;
  points: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
    // const mask = this.manager.fromMask(this.prediction);
    //
    // // index of object
    // const index = 0;
    //
    // return this.manager.getMask()[index].getMask({ kind: "filled" }).toDataURL();
  }

  deselect() {}

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);

    this.predict();
  }

  select(category: Category) {}

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
            .resizeBilinear([height, width]);
        }
      }
    });

    if (prediction) {
      tensorflow.browser
        .toPixels(prediction as tensorflow.Tensor3D)
        .then(async (clamped) => {
          this.prediction = new ImageJS.Image({
            width: width,
            height: height,
            data: clamped,
          });

          const mask = this.prediction.grey().mask();
          const rois = this.manager.fromMask(mask).getRois();
          rois.sort((a: any, b: any) => b.surface - a.surface);
          const roi = rois[0];
          const contour = roi.getMask({ kind: "contour" });
          const data = contour.getRGBAData();

          // for (let x = 0; x < contour.width; x++) {
          //   for (let y = 0; y < contour.height; y++) {
          //     const current = data[(y * contour.width + x) * 4];
          //     if (current) {
          //       this.points.push(x);
          //       this.points.push(y);
          //     }
          //   }
          // }
          // debugger;
        });
    }
  }
}
