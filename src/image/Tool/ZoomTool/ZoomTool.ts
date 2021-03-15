import { Tool } from "../Tool";
import { ZoomMode } from "../../../types/ZoomMode";
import * as _ from "lodash";
import numeral from "numeral";
import { KonvaEventObject } from "konva/types/Node";

export class ZoomTool extends Tool {
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

  selected = false;

  private scales: Array<number> = [0.25, 0.75, 1.0, 2.0, 4.0, 8.0, 16.0, 32.0];

  get percentile(): string {
    return numeral(this.scale).format("0%");
  }

  get percentiles(): Array<string> {
    return _.map(this.scales, (scale: number) => {
      return numeral(scale).format("0%");
    });
  }

  /**
   * Zoom to fit the image to the application window.
   */
  fit() {}

  /**
   * Zoom the image to its actual size.
   */
  reset() {
    this.scale = 1.0;

    this.x = 0;
    this.y = 0;

    this.selected = false;
    this.zooming = false;
  }

  onMouseDown(position: { x: number; y: number }) {
    this.minimum = position;

    this.zooming = true;

    this.selected = false;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.zooming || !this.minimum) return;

    this.maximum = position;
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.zooming || !this.minimum || !this.maximum)
      return;

    if (this.mode === ZoomMode.In) {
      this.maximum = position;

      this.scale = Math.abs(
        this.image.width / (this.maximum.x - this.minimum.x)
      );

      const x =
        this.minimum.x > this.maximum.x ? this.maximum.x : this.minimum.x;
      const y =
        this.minimum.y > this.maximum.y ? this.maximum.y : this.minimum.y;

      this.x = -1 * x * this.scale;
      this.y = -1 * y * this.scale;
    }

    this.selected = true;
    this.maximum = undefined;
    this.zooming = false;
  }

  onClick = (event: KonvaEventObject<MouseEvent>) => {
    if (event.evt.button !== 0) return;

    event.evt.preventDefault();

    const stage = event.target.getStage();

    if (!stage) return;

    const position = stage.getPointerPosition();

    if (!position) return;

    if (this.mode === ZoomMode.In) {
      if (this.scale === 32.0) return;

      const index = _.findIndex(this.scales, (scale) => {
        return this.scale < scale;
      });

      if (!index) return;

      this.scale = this.scales[index];
    } else {
      if (this.scale === 0.25) return;

      const index = _.findIndex(this.scales, (scale) => {
        return this.scale <= scale;
      });

      if (!index) return;

      this.scale = this.scales[index - 1];
    }

    this.x = position.x - position.x * this.scale;
    this.y = position.y - position.y * this.scale;

    this.selected = true;
  };

  onWheel = (event: KonvaEventObject<WheelEvent>) => {
    const newScale = event.evt.deltaY > 0 ? this.scale * 1.1 : this.scale / 1.1;

    if (newScale > 125 || newScale < 0.05) return;

    const stage = event.target.getStage();

    if (!stage) return;

    const position = stage.getPointerPosition();

    if (!position) return;

    const origin = {
      x: position.x / this.scale - stage.x() / this.scale,
      y: position.y / this.scale - stage.y() / this.scale,
    };

    this.x = -(origin.x - position.x / newScale) * newScale;
    this.y = -(origin.y - position.y / newScale) * newScale;

    this.scale = newScale;
  };
}
