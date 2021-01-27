import { SelectionOperator } from "./SelectionOperator";
import * as tensorflow from "@tensorflow/tfjs";
import {RectangularSelectionOperator} from "./RectangularSelectionOperator";
import * as ImageJS from "image-js";

export class ObjectSelectionOperator extends RectangularSelectionOperator {
  model?: tensorflow.LayersModel;

  constructor(image: ImageJS.Image) {
    super(image);

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

  onMouseDown(position: { x: number; y: number }) {
    super.onMouseDown(position);
  }

  onMouseMove(position: { x: number; y: number }) {
    super.onMouseMove(position)
  }

  onMouseUp(position: { x: number; y: number }) {
    super.onMouseUp(position);
    //
    // const crop = this.image!.crop({
    //   x: this.rectangularSelector.origin!.x,
    //   y: this.rectangularSelector.origin!.y,
    //   width: this.rectangularSelector.width,
    //   height: this.rectangularSelector.height
    // })
    //
    // const canvas = crop.getCanvas();
    //
    // const croppedInput: tensorflow.Tensor3D = tensorflow.browser.fromPixels(canvas);


    // this.predict(croppedInput)
  }

  select(category: number) {}

  private predict() {

  }
}
