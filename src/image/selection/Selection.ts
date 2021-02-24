import * as ImageJS from "image-js";
import { Category } from "../../types/Category";

export class Selection {
  category: Category;
  mask: ImageJS.Image;

  constructor(category: Category, mask: ImageJS.Image) {
    this.category = category;

    this.mask = mask;
  }

  /*
   * Adding to a selection adds any new areas you select to your existing
   * selection.
   */
  add(selection: Selection) {
    selection.mask.data.forEach((currentValue: number, index: number) => {
      if (currentValue === 255) {
        this.mask.data[index] = 255;
      }
    });
  }

  subtract(selection: Selection) {}

  intersect(selection: Selection) {
    // @ts-ignore
    this.mask = this.mask.getIntersection(selection.mask);
  }

  invert() {
    this.mask.data.forEach((_: number, index: number) => {
      this.mask.data[index] = ~this.mask.data[index];
    });
  }
}
