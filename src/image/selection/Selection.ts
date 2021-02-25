import { Category } from "../../types/Category";
import * as uuid from "uuid";

export class Selection {
  category: Category;
  id: string;
  mask: Array<number>;

  constructor(category: Category, mask: Array<number>) {
    this.category = category;

    this.id = uuid.v4();

    this.mask = mask;
  }

  get boundingBox(): [number, number, number, number] {
    return [0, 0, 0, 0];
  }

  get contour(): Array<number> {
    return [];
  }

  /*
   * Adding to a selection adds any new areas you select to your existing
   * selection.
   */
  add(selection: Selection) {
    selection.mask.forEach((currentValue: number, index: number) => {
      if (currentValue === 255) {
        this.mask[index] = 255;
      }
    });
  }

  /*
   * Subtracting from a selection deselects the areas you draw over, keeping
   * the rest of your existing selection.
   */
  subtract(selection: Selection) {
    selection.mask.forEach((currentValue: number, index: number) => {
      if (currentValue === 0) {
        this.mask[index] = 0;
      }
    });
  }

  /*
   * When using the Intersect selection mode, any currently selected areas you
   * select over will be kept and any currently selected areas outside your
   * new selection will be removed from the selection.
   */
  intersect(selection: Selection) {}

  invert() {
    this.mask.forEach((currentValue: number, index: number) => {
      this.mask[index] = ~this.mask[index];
    });
  }
}
