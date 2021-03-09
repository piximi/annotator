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

  private scales: Array<number> = [
    0.25,
    0.75,
    1.0,
    1.25,
    1.5,
    1.75,
    2.0,
    4.0,
    8.0,
    16.0,
    32.0,
  ];

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
  }

  // onClick(position: { x: number; y: number }) {
  //   const index = _.findIndex(this.scales, this.scale);
  //
  //   if (!index) return;
  //
  //   if (this.mode === ZoomMode.In) {
  //     if (this.scale === 32.0) return;
  //
  //     this.scale = this.scales[index + 1];
  //   } else {
  //     if (this.scale === 0.25) return;
  //
  //     this.scale = this.scales[index - 1];
  //   }
  //
  //   if (this.center) return;
  //
  //   this.x = position.x;
  //   this.y = position.y;
  // }

  onMouseDown(position: { x: number; y: number }) {
    this.minimum = position;

    this.zooming = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.zooming) return;

    this.maximum = position;
  }

  onMouseUp(position: { x: number; y: number }) {
    if (!this.zooming) return;

    // click event
    if (!this.maximum) {
      const index = _.indexOf(this.scales, this.scale);

      if (!index) return;

      if (this.mode === ZoomMode.In) {
        if (this.scale === 32.0) return;

        this.scale = this.scales[index + 1];
      } else {
        if (this.scale === 0.25) return;

        this.scale = this.scales[index - 1];
      }

      this.zooming = false;
      this.selected = true;

      //FIXME incoroporate below
      // if (this.center) return;
      // this.x = position.x;
      // this.y = position.y;
    } else {
      this.maximum = position;

      this.selected = true;

      this.zooming = false;
    }
  }
}
