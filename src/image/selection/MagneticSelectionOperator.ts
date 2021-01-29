import { SelectionOperator } from "./SelectionOperator";
import { createPathFinder, makeGraph, PiximiGraph } from "../GraphHelper";
import { getIdx } from "../imageHelper";
import { transformCoordinatesToStrokes } from "../pathfinder/PathFinder";

export class MagneticSelectionOperator extends SelectionOperator {
  graph?: PiximiGraph;
  scalingFactor: number = 0.5;
  downsizedWidth: number = 0;
  pathFinder?: { find: (fromId: number, toId: number) => any };
  points?: Array<number>;
  previous: Array<number> = [];
  buffer: Array<number> = [];
  origin: { x: number; y: number } = { x: 0, y: 0 };
  canClose: boolean = false;
  currentPosition?: { x: number; y: number };
  anchor?: { x: number; y: number }; // Not sure this is even necessary

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {
    this.selected = false;
    this.selecting = false;

    this.center = undefined;
    this.origin = undefined;
    this.radius = undefined;
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.selected) {
      return;
    }

    this.currentPosition = position;

    if (this.connected(this.currentPosition)) {
      this.selected = true;
      this.selecting = false;
    } else {
      this.selecting = true;

      this.origin = this.currentPosition;

      if (this.buffer.length > 0) {
        this.anchor = this.currentPosition;

        this.previous = [...this.previous, ...this.buffer];
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) {
      return;
    }

    this.currentPosition = position;

    if (this.currentPosition) {
      if (
        !this.canClose &&
        !this.isInside(
          magneticSelectionStartingAnchorCircleRef,
          this.currentPosition
        )
      ) {
        this.canClose = true;
      }

      // let startPosition;
      if (this.pathFinder && this.origin) {
        const pathCoords = this.pathFinder.find(
          getIdx(this.downsizedWidth, 1)(
            Math.floor(this.origin.x * this.scalingFactor),
            Math.floor(this.origin.y * this.scalingFactor),
            0
          ),
          getIdx(this.downsizedWidth, 1)(
            Math.floor(this.currentPosition.x * this.scalingFactor),
            Math.floor(this.currentPosition.y * this.scalingFactor),
            0
          )
        );

        this.buffer = transformCoordinatesToStrokes(pathCoords);
      }
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) {
      return;
    }

    this.currentPosition = position;

    if (this.connected(position)) {
      if (this.origin) {
        this.buffer = [
          ...this.buffer,
          position.x,
          position.y,
          this.origin.x,
          this.origin.y,
        ];
      }

      this.selected = true;
      this.selecting = false;

      this.points = this.buffer;

      this.buffer = [];
    } else {
      if (this.buffer.length > 0) {
        this.anchor = position;

        this.origin = this.currentPosition;

        this.previous = [...this.previous, ...this.buffer];
      } else {
        this.origin = this.currentPosition;
      }
    }
  }

  select(category: number) {
    if (!this.image) {
      console.log("Error: no image");
      return;
    }

    if (!this.graph) {
      console.log("Creating graph");
      const grey = this.image!.grey();
      const edges = grey.sobelFilter();
      this.downsizedWidth = this.image!.width * this.scalingFactor;
      const downsized = edges.resize({ factor: this.scalingFactor });
      this.graph = makeGraph(downsized.data, downsized.height, downsized.width);
      console.log("Creating pathfinder");
      this.pathFinder = createPathFinder(
        this.graph,
        this.downsizedWidth,
        this.scalingFactor
      );
    }

    if (!this.boundingBox || !this.mask) return;

    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category,
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
}
