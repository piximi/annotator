import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  graph?: tensorflow.LayersModel;
  prediction?: ImageJS.Image;

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
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

    const crop = this.image.crop({
      x: this.origin.x,
      y: this.origin.y,
      width: this.width,
      height: this.height,
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
            .resizeBilinear([this.height!, this.width!]);
        }
      }
    });

    if (prediction) {
      tensorflow.browser
        .toPixels(prediction as tensorflow.Tensor3D)
        .then((clamped) => {
          const array = new Uint8Array(Array.from(clamped));

          ImageJS.Image.load(array).then((image) => {
            this.prediction = image;
          });
        });

      console.info(this.prediction);
    }
  }
}
