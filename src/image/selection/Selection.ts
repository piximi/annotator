import * as ImageJS from "image-js";

export class Selection {
  mask: ImageJS.Image;

  constructor(mask: ImageJS.Image) {
    this.mask = mask;
  }

  add(selection: Selection) {}

  subtract(selection: Selection) {}

  intersect(selection: Selection) {}
}
