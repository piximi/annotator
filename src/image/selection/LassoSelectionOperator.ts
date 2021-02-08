import { SelectionOperator } from "./SelectionOperator";
import * as _ from "lodash";
import { Category } from "../../types/Category";
import * as ImageJS from "image-js";
import { drawLine } from "../imageHelper";

export class LassoSelectionOperator extends SelectionOperator {
  anchor?: { x: number; y: number };
  buffer: Array<number> = [];
  origin?: { x: number; y: number };
  points: Array<number> = [];

  get boundingBox(): [number, number, number, number] | undefined {
    if (!this.origin || !this.points) return undefined;

    const pairs = _.chunk(this.points, 2);

    return [
      this.origin.x,
      this.origin.y,
      _.max(_.map(pairs, _.first))!,
      _.max(_.map(pairs, _.last))!,
    ];
  }

  get mask() {
    const foo = new ImageJS.Image({
      width: this.image.width,
      height: this.image.height,
      bitDepth: 8,
    });
    // _.chunk(this.points, 2).forEach((position: Array<number>) => {
    //   foo.setPixelXY(Math.floor(position[0]), Math.floor(position[1]), [
    //     255,
    //     255,
    //     255,
    //     0,
    //   ]);
    // });
    const coords = _.chunk(this.points, 2);

    coords.forEach((_position: Array<number>, index) => {
      if (index < coords.length - 1)
        drawLine(foo, coords[index], coords[index + 1]);
    });
    debugger;
    return foo.toDataURL();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.selection = undefined;

    this.anchor = undefined;
    this.buffer = [];
    this.origin = undefined;
    this.points = [];
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (this.connected(position)) {
      if (this.origin) {
        this.buffer = [...this.buffer, this.origin.x, this.origin.y];
      }

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this.anchor = undefined;
      this.origin = undefined;
    }

    if (this.buffer && this.buffer.length === 0) {
      this.selecting = true;

      if (!this.origin) {
        this.origin = position;
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    if (this.anchor) {
      if (
        this.buffer[this.buffer.length - 2] !== this.anchor.x ||
        this.buffer[this.buffer.length - 1] !== this.anchor.y
      ) {
        this.buffer.pop();
        this.buffer.pop();
      }

      this.buffer = [...this.buffer, position.x, position.y];

      return;
    }

    if (this.origin) {
      this.buffer = [...this.buffer, position.x, position.y];
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    if (
      this.connected(position) &&
      this.origin &&
      this.buffer &&
      this.buffer.length > 0
    ) {
      this.buffer = [
        ...this.buffer,
        position.x,
        position.y,
        this.origin.x,
        this.origin.y,
      ];

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this.buffer = [];
      const foo = this.mask;
      return;
    }

    if (this.anchor) {
      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [...this.buffer, position.x, position.y];

      this.anchor = position;

      return;
    }

    if (this.origin && this.buffer && this.buffer.length > 0) {
      this.anchor = position;
      return;
    }
  }

  select(category: Category) {
    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      mask: this.mask,
    };
  }

  private connected(
    position: { x: number; y: number },
    threshold: number = 4
  ): boolean | undefined {
    if (!this.origin) return undefined;

    const distance = Math.hypot(
      position.x - this.origin.x,
      position.y - this.origin.y
    );

    return distance < threshold;
  }
}
