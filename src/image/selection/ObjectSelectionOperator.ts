import { SelectionOperator } from "./SelectionOperator";
import * as tensorflow from "@tensorflow/tfjs";

export class ObjectSelectionOperator extends SelectionOperator {

  model?: tensorflow.LayersModel;

  constructor() {
    super()
    const pathname =
        "https://raw.githubusercontent.com/zaidalyafeai/HostedModels/master/unet-128/model.json";
    tensorflow.loadLayersModel(pathname).then( (graph) => {
      const optimizer = tensorflow.train.adam();
      graph.compile({
        optimizer: optimizer,
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"],
      });
      this.model = graph
    })
  }

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  select(category: number) {};
}
