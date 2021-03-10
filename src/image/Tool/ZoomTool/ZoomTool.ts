import { Tool } from "../Tool";
import { ZoomMode } from "../../../types/ZoomMode";
import * as _ from "lodash";
import numeral from "numeral";

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

  MIN_DELTA_X = 5;
  MIN_SCALE = 0.25;
  MAX_SCALE = 32;
  DELTA_SCALE = 0.25;

  private scales: Array<number> = [
    this.MIN_SCALE,
    0.75,
    1.0,
    1.25,
    1.5,
    1.75,
    2.0,
    4.0,
    8.0,
    16.0,
    this.MAX_SCALE,
  ];

  get percentile(): string {
    return numeral(this.scale).format("0%");
  }

  get percentiles(): Array<string> {
    return _.map(this.scales, (scale: number) => {
      return numeral(scale).format("0%");
    });
  }

  deselect() {
    this.maximum = undefined;
    this.minimum = undefined;

    this.selected = false;
    this.zooming = false;
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

    if (Math.abs(position.x - this.minimum.x) > this.MIN_DELTA_X) {
      this.maximum = position;
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.zooming || !this.minimum) return;

    if (!this.maximum) {
      const index = _.indexOf(this.scales, this.scale);

      if (!index) return;

      if (index === -1) {
        if (this.mode === ZoomMode.In) {
          this.scale += this.DELTA_SCALE;
        } else {
          this.scale -= this.DELTA_SCALE;
        }
      } else {
        if (this.mode === ZoomMode.In) {
          if (this.scale === this.MAX_SCALE) return;

          this.scale = this.scales[index + 1];
        } else {
          if (this.scale === this.MIN_SCALE) return;

          this.scale = this.scales[index - 1];
        }
      }

      this.x = this.minimum.x - this.minimum.x * this.scale;
      this.y = this.minimum.y - this.minimum.y * this.scale;

      this.selected = true;

      //FIXME: uncomment below when we have a "automatically center" option
      // if (this.center) return;
    } else {
      if (this.mode === ZoomMode.In) {
        this.maximum = position;

        this.scale = this.image.width / (this.maximum.x - this.minimum.x);

        this.x = -1 * this.minimum.x * this.scale;
        this.y = -1 * this.minimum.y * this.scale;
      }

      // //deselect
      // this.selected = false;
      // this.minimum = undefined;
      // this.maximum = undefined;
      this.selected = true;
    }
  }
}
