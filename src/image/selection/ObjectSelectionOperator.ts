import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  graph?: tensorflow.LayersModel;

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);

    // do stuff
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

  private predict() {}
}
