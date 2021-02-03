import { RectangularSelectionOperator } from "./RectangularSelectionOperator";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import * as tensorflow from "@tensorflow/tfjs";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  constructor(image: ImageJS.Image) {
    super(image);

    const pathname =
      "https://raw.githubusercontent.com/zaidalyafeai/HostedModels/master/unet-128/model.json";

    const graph = await tensorflow.loadLayersModel(pathname);

    console.log(graph);

    const optimizer = tensorflow.train.adam();

    graph.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
  }

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

  private predict() {}
}
