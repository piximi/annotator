import { Operator } from "../Operator";
import { ZoomMode } from "../../../types/ZoomMode";
import * as _ from "lodash";

export class ZoomOperator extends Operator {
  /**
   * Automatically center the image.
   */
  center: boolean = false;

  minimum?: { x: number; y: number };
  maximum?: { x: number; y: number };

  mode: ZoomMode = ZoomMode.In;

  scale: number = 1.0;

  x: number = 0;
  y: number = 0;

  zooming: boolean = false;

  private scales: Array<number> = [0.25, 0.75, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0];

  onClick(position: { x: number; y: number }) {
    const index = _.findIndex(this.scales, this.scale);

    if (!index) return;

    if (this.mode === ZoomMode.In) {
      if (this.scale === 32.0) return;

      this.scale = this.scales[index + 1];
    } else {
      if (this.scale === 0.25) return;

      this.scale = this.scales[index - 1];
    }

    if (this.center) return;

    this.x = position.x;
    this.y = position.y;
  }

  onMouseDown(position: { x: number; y: number }) {
    this.minimum = position;
  }

  onMouseMove(position: { x: number; y: number }, pressed: boolean) {
    if (!this.zooming) return;
  }

  onMouseUp(position: { x: number; y: number }) {
    if (!this.zooming) return;
  }

  /**
   * Zoom to fit the image to the application window.
   */
  private fit() {}

  /**
   * Zoom the image to its actual size.
   */
  private reset() {
    this.scale = 1.0;
  }
}
