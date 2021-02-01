import { SelectionOperator } from "./SelectionOperator";
import {Category} from "../../types/Category";

export class EllipticalSelectionOperator extends SelectionOperator {
  center?: { x: number; y: number };
  origin?: { x: number; y: number };
  radius?: { x: number; y: number };

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.center || !this.origin || !this.radius) return undefined;

    return [
      this.origin.x,
      this.origin.y,
      this.center.x + this.radius.x,
      this.center.y + this.radius.y,
    ];
  }

  get mask(): string | undefined {
    return "mask";
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.center = undefined;
    this.origin = undefined;
    this.radius = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    this.origin = position;

    this.selecting = true;
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected) return;

    this.resize(position);
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    this.resize(position);

    this.selected = true;

    this.selecting = false;
  }

  select(category: Category) {
    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      mask: this.mask,
    };
  }

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.center = {
        x: (position.x - this.origin.x) / 2 + this.origin.x,
        y: (position.y - this.origin.y) / 2 + this.origin.y,
      };

      this.radius = {
        x: Math.abs((position.x - this.origin.x) / 2),
        y: Math.abs((position.y - this.origin.y) / 2),
      };
    }
  }
}
