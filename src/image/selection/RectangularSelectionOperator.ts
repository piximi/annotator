import { SelectionOperator } from "./SelectionOperator";

export class RectangularSelectionOperator extends SelectionOperator {
  origin?: { x: number; y: number };

  width?: number;
  height?: number;

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.width || !this.height) return undefined;

    return [
      this.origin.x,
      this.origin.y,
      this.origin.x + this.width,
      this.origin.y + this.height
    ];
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {
    this.selected = false;

    this.selecting = false;
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

  select(category: number) {
    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      box: this.boundingBox,
      category: category,
      mask: this.mask,
    };

    this.deselect();
  };

  private resize(position: { x: number; y: number }) {
    if (this.origin) {
      this.width = position.x - this.origin.x;
      this.height = position.y - this.origin.y;
    }
  }
}
