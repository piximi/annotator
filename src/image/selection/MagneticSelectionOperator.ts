import { SelectionOperator } from "./SelectionOperator";
import { createPathFinder, makeGraph, PiximiGraph } from "../GraphHelper";
import { getIdx } from "../imageHelper";
import * as ImageJS from "image-js";
import {Category} from "../../types/Category";

export class MagneticSelectionOperator extends SelectionOperator {
  graph?: PiximiGraph;
  scalingFactor: number = 0.5;
  downsizedWidth: number = 0;
  pathFinder?: { find: (fromId: number, toId: number) => any };
  points: Array<number> = [];
  previous: Array<number> = []; // Full path coordinate list
  buffer: Array<number> = []; // Current path coordinate list
  origin?: { x: number; y: number }; // Point where the full path started, where we go to close the polygon.
  anchor?: { x: number; y: number }; // Point we're pathing from in the current segment

  constructor(image: ImageJS.Image) {
    super(image);

    if (!this.graph && this.image) {
      console.log("Creating graph");
      const grey = this.image.grey();
      const edges = grey.sobelFilter();
      this.downsizedWidth = this.image.width * this.scalingFactor;
      const downsized = edges.resize({ factor: this.scalingFactor });
      this.graph = makeGraph(downsized.data, downsized.height, downsized.width);
      console.log("Creating pathfinder");
      this.pathFinder = createPathFinder(
        this.graph,
        this.downsizedWidth,
        this.scalingFactor
      );
    }
  }

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) return;

    if (this.connected(position) && this.origin) {
      this.selected = true;
      this.selecting = false;

      this.buffer = [...this.buffer, this.origin.x, this.origin.y];

      return;
    }

    if (!this.origin) {
      this.origin = position;
    }

    this.anchor = position;

    this.selecting = true;

    this.previous = [...this.previous, ...this.buffer];
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) return;

    // let startPosition;
    if (this.origin) {
      const pathCoords = this.pathFinder!.find(
        getIdx(this.downsizedWidth, 1)(
          Math.floor(this.anchor!.x * this.scalingFactor),
          Math.floor(this.anchor!.y * this.scalingFactor),
          0
        ),
        getIdx(this.downsizedWidth, 1)(
          Math.floor(position.x * this.scalingFactor),
          Math.floor(position.y * this.scalingFactor),
          0
        )
      );

      this.buffer = [
        this.anchor!.x,
        this.anchor!.y,
        ...this.transformCoordinatesToStrokes(pathCoords),
      ];
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

    if (this.buffer.length > 0) {
      this.anchor = position;

      this.origin = position;

      this.previous = [...this.previous, ...this.buffer];
    } else {
      this.origin = position;
    }
  }

  select(category: Category) {
    if (!this.image) {
      console.log("Error: no image");
      return;
    }

    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category.id,
      mask: this.mask,
    };
  }

  private connected(
    position: { x: number; y: number },
    threshold: number = 2
  ): boolean | undefined {
    if (!this.origin) return undefined;

    const distance = Math.hypot(
      position.x - this.origin.x,
      position.y - this.origin.y
    );

    return distance < threshold;
  }

  private transformCoordinatesToStrokes(
    coordinates: Array<Array<number>>
  ): Array<number> {
    const strokes = [];

    for (let index = 0; index < coordinates.length - 1; index++) {
      const [endX, endY] = coordinates[index + 1];

      strokes.push(endX, endY);
    }

    return strokes;
  }
}
