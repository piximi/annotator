import { Operator } from "../Operator";
import { ZoomMode } from "../../../types/ZoomMode";

export class ZoomOperator extends Operator {
  /**
   * Automatically center the image.
   */
  center: boolean = false;

  mode: ZoomMode = ZoomMode.In;

  onMouseDown(position: { x: number; y: number }) {}

  onMouseMove(position: { x: number; y: number }) {}

  onMouseUp(position: { x: number; y: number }) {}

  /**
   * Zoom to fit the image to the application window.
   */
  private fit() {}

  /**
   * Zoom the image to its actual size.
   */
  private reset() {}
}
