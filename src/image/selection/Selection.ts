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
    const mask = this.mask.getIntersection(selection.mask);

    return new Selection(this.category, mask);
  }
}
