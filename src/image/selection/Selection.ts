import * as ImageJS from "image-js";
import { Category } from "../../types/Category";

export class Selection {
  category: Category;
  mask: ImageJS.Image;

  constructor(category: Category, mask: ImageJS.Image) {
    this.category = category;

    this.mask = mask;
  }

  add(selection: Selection) {}

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
