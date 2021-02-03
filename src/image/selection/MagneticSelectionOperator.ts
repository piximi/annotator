import { SelectionOperator } from "./SelectionOperator";
import { createPathFinder, makeGraph, PiximiGraph } from "../GraphHelper";
import { getIdx } from "../imageHelper";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";
import * as _ from "lodash";

export class MagneticSelectionOperator extends SelectionOperator {
  anchor?: { x: number; y: number };
  buffer: Array<number> = [];
  graph?: PiximiGraph;
  origin?: { x: number; y: number };
  points: Array<number> = [];
  response?: ImageJS.Image;
  pathfinder?: { find: (fromId: number, toId: number) => any };
  factor: number;

  constructor(image: ImageJS.Image, factor: number = 0.5) {
    super(image);

    this.factor = factor;

    this.filter(factor);

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
    return "mask";
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

      const path = this.pathfinder.find(source, destination);

      if (
        this.buffer[this.buffer.length - 2] !== this.anchor.x ||
        this.buffer[this.buffer.length - 1] !== this.anchor.y
      ) {
        this.buffer.pop();
        this.buffer.pop();
      }

      this.buffer = [this.anchor.x, this.anchor.y, ...this.transform(path)];

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

      const path = this.pathfinder.find(source, destination);

      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [this.origin.x, this.origin.y, ...this.transform(path)];
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

    if (this.anchor) {
      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [...this.buffer, position.x, position.y];

      this.anchor = position;

      return;
    }

    if (this.origin && this.buffer.length > 0) {
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

  private filter(factor: number = 0.5) {
    if (this.image) {
      const options = { factor: this.image.width * factor };

      this.response = this.image.grey().sobelFilter(); //.resize(options);
    }
  }

  private transform(coordinates: Array<Array<number>>): Array<number> {
    const strokes = [];

    for (let index = 0; index < coordinates.length - 1; index++) {
      const [endX, endY] = coordinates[index + 1];

      strokes.push(endX, endY);
    }

    return strokes;
  }
}

// export class MagneticSelectionOperator extends SelectionOperator {
//   graph?: PiximiGraph;
//   scalingFactor: number = 0.5;
//   downsizedWidth: number = 0;
//   pathFinder?: { find: (fromId: number, toId: number) => any };
//   points: Array<number> = [];
//   previous: Array<number> = []; // Full path coordinate list
//   buffer: Array<number> = []; // Current path coordinate list
//   origin?: { x: number; y: number }; // Point where the full path started, where we go to close the polygon.
//   anchor?: { x: number; y: number }; // Point we're pathing from in the current segment
//
//   constructor(image: ImageJS.Image) {
//     super(image);
//
//     if (!this.graph && this.image) {
//       console.log("Creating graph");
//       const grey = this.image.grey();
//       const edges = grey.sobelFilter();
//       this.downsizedWidth = this.image.width * this.scalingFactor;
//       const downsized = edges.resize({ factor: this.scalingFactor });
//       this.graph = makeGraph(downsized.data, downsized.height, downsized.width);
//       console.log("Creating pathfinder");
//       this.pathFinder = createPathFinder(
//         this.graph,
//         this.downsizedWidth,
//         this.scalingFactor
//       );
//     }
//   }
//
//   get boundingBox(): [number, number, number, number] | undefined {
//     return undefined;
//   }
//
//   get mask(): string | undefined {
//     return undefined;
//   }
//
//   deselect() {}
//
//   onMouseDown(position: { x: number; y: number }) {
//     if (this.selected) return;
//
//     if (this.connected(position) && this.origin) {
//       this.selected = true;
//       this.selecting = false;
//
//       this.buffer = [...this.buffer, this.origin.x, this.origin.y];
//
//       return;
//     }
//
//     if (!this.origin) {
//       this.origin = position;
//     }
//
//     this.anchor = position;
//
//     this.selecting = true;
//
//     this.previous = [...this.previous, ...this.buffer];
//   }
//
//   onMouseMove(position: { x: number; y: number }) {
//     if (this.selected || !this.selecting) return;
//
//     // let startPosition;
//     if (this.origin) {
//       const pathCoords = this.pathFinder!.find(
//         getIdx(this.downsizedWidth, 1)(
//           Math.floor(this.anchor!.x * this.scalingFactor),
//           Math.floor(this.anchor!.y * this.scalingFactor),
//           0
//         ),
//         getIdx(this.downsizedWidth, 1)(
//           Math.floor(position.x * this.scalingFactor),
//           Math.floor(position.y * this.scalingFactor),
//           0
//         )
//       );
//
//       this.buffer = [
//         this.anchor!.x,
//         this.anchor!.y,
//         ...this.transformCoordinatesToStrokes(pathCoords),
//       ];
//     }
//   }
//
//   onMouseUp(position: { x: number; y: number }) {
//     if (this.selected || !this.selecting) return;
//
//     if (
//       this.connected(position) &&
//       this.origin &&
//       this.buffer &&
//       this.buffer.length > 0
//     ) {
//       this.buffer = [
//         ...this.buffer,
//         position.x,
//         position.y,
//         this.origin.x,
//         this.origin.y,
//       ];
//
//       this.selected = true;
//       this.selecting = false;
//
//       this.points = this.buffer;
//
//       this.buffer = [];
//
//       return;
//     }
//
//     if (this.buffer.length > 0) {
//       this.anchor = position;
//
//       this.origin = position;
//
//       this.previous = [...this.previous, ...this.buffer];
//     } else {
//       this.origin = position;
//     }
//   }
//
//   select(category: Category) {
//     if (!this.image) {
//       console.log("Error: no image");
//       return;
//     }
//
//     if (!this.boundingBox || !this.mask) return;
//
//     this.selection = {
//       boundingBox: this.boundingBox,
//       categoryId: category.id,
//       mask: this.mask,
//     };
//   }
//
//   private connected(
//     position: { x: number; y: number },
//     threshold: number = 2
//   ): boolean | undefined {
//     if (!this.origin) return undefined;
//
//     const distance = Math.hypot(
//       position.x - this.origin.x,
//       position.y - this.origin.y
//     );
//
//     return distance < threshold;
//   }
//
//   private transformCoordinatesToStrokes(
//     coordinates: Array<Array<number>>
//   ): Array<number> {
//     const strokes = [];
//
//     for (let index = 0; index < coordinates.length - 1; index++) {
//       const [endX, endY] = coordinates[index + 1];
//
//       strokes.push(endX, endY);
//     }
//
//     return strokes;
//   }
// }
