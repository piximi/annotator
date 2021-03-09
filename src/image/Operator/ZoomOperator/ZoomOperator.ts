import { Operator } from "../Operator";
import { ZoomMode } from "../../../types/ZoomMode";

export class ZoomOperator extends Operator {
  /**
   * Automatically center the image.
   */
  center: boolean = false;

  mode: ZoomMode = ZoomMode.In;

  scale: number = 1.0;

  x: number = 0;
  y: number = 0;

  zooming: boolean = false;

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {
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
