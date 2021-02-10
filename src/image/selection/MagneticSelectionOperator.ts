import { SelectionOperator } from "./SelectionOperator";
import { createPathFinder, makeGraph, PiximiGraph } from "../GraphHelper";
import { connectPoints, getIdx } from "../imageHelper";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";
import * as _ from "lodash";
import { simplify } from "../simplify/simplify";
import { slpf } from "../polygon-fill/slpf";

export class MagneticSelectionOperator extends SelectionOperator {
  anchor?: { x: number; y: number };
  buffer: Array<number> = [];
  factor: number;
  graph?: PiximiGraph;
  origin?: { x: number; y: number };
  path: Array<number> = [];
  pathfinder?: { find: (fromId: number, toId: number) => any };
  points: Array<number> = [];
  previous: Array<number> = [];
  response?: ImageJS.Image;

  constructor(image: ImageJS.Image, factor: number = 0.5) {
    super(image);

    this.factor = factor;

    this.filter();

    if (!this.image || !this.response) return;

    this.graph = makeGraph(
      this.response.data,
      this.response.height,
      this.response.width
    );

    this.pathfinder = createPathFinder(
      this.graph,
      this.image.width * factor,
      factor
    );
  }

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

  get mask(): string | undefined {
    const maskImage = new ImageJS.Image({
      width: this.image.width,
      height: this.image.height,
      bitDepth: 8,
    });

    const coords = _.chunk(this.points, 2);

    const connectedPoints = connectPoints(coords, maskImage); // get coordinates of connected points and draw boundaries of mask
    simplify(connectedPoints, 1, true);
    slpf(connectedPoints, maskImage);

    return maskImage.toDataURL();
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.selection = undefined;

    this.anchor = undefined;
    this.buffer = [];
    this.graph = undefined;
    this.origin = undefined;
    this.pathfinder = undefined;
    this.points = [];
    this.previous = [];
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
    }

    if (this.buffer && this.buffer.length === 0) {
      this.selecting = true;

      if (!this.origin) {
        this.origin = position;
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.image || !this.pathfinder || this.selected || !this.selecting)
      return;

    if (this.anchor) {
      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(this.anchor.x * this.factor),
        Math.floor(this.anchor.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(position.x * this.factor),
        Math.floor(position.y * this.factor),
        0
      );

      this.path = _.flatten(this.pathfinder.find(source, destination));

      if (
        this.buffer[this.buffer.length - 2] !== this.anchor.x ||
        this.buffer[this.buffer.length - 1] !== this.anchor.y
      ) {
        this.buffer.pop();
        this.buffer.pop();
      }

      this.buffer = [
        ...this.previous,
        this.anchor.x,
        this.anchor.y,
        ...this.path,
      ];

      return;
    }

    if (this.origin) {
      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(this.origin.x * this.factor),
        Math.floor(this.origin.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(position.x * this.factor),
        Math.floor(position.y * this.factor),
        0
      );

      this.path = _.flatten(this.pathfinder.find(source, destination));

      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [this.origin.x, this.origin.y, ...this.path];
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

      return;
    }

    if (this.anchor && this.image) {
      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(this.anchor.x * this.factor),
        Math.floor(this.anchor.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(position.x * this.factor),
        Math.floor(position.y * this.factor),
        0
      );

      if (!this.pathfinder) return;

      this.path = _.flatten(this.pathfinder.find(source, destination));

      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [...this.previous, ...this.path];

      this.previous = [...this.previous, ...this.path];

      this.anchor = position;

      return;
    }

    if (this.origin && this.buffer.length > 0) {
      if (!this.image || !this.origin || !this.pathfinder) return;

      this.anchor = position;

      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(this.origin.x * this.factor),
        Math.floor(this.origin.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(position.x * this.factor),
        Math.floor(position.y * this.factor),
        0
      );

      this.path = _.flatten(this.pathfinder.find(source, destination));

      this.buffer = [this.origin.x, this.origin.y, ...this.path];

      this.previous = [
        ...this.previous,
        this.origin.x,
        this.origin.y,
        ...this.path,
      ];

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

  private filter() {
    if (!this.image) return;

    const options = { factor: this.factor };

    this.response = this.image.resize(options).grey().sobelFilter();
  }
}
