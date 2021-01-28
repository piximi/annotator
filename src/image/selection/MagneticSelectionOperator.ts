import { SelectionOperator } from "./SelectionOperator";
import * as _ from "underscore";
import {createPathFinder, makeGraph, PiximiGraph} from "../GraphHelper";
import {getIdx} from "../imageHelper";
import {transformCoordinatesToStrokes} from "../pathfinder/PathFinder";

export class MagneticSelectionOperator extends SelectionOperator {
  graph? : PiximiGraph;
  scalingFactor : number = 0.5;
  downsizedWidth : number = 0;
  pathFinder?: { find: (fromId: number, toId: number) => any; };
  annotation?: { points: Array<number> };
  previousStroke : Array<{ points: Array<number> }> = [];
  strokes : Array<{ points: Array<number> }> = [];
  startPosition : { x: number; y: number; } = {x: 0, y: 0};
  canClose : boolean = false;
  currentPosition? : { x: number; y: number };
  anchor? : { x: number; y: number; }; // Not sure this is even necessary

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

    if (magnetConnected(this.currentPosition)) {
      this.annotation = {
        points: _.flatten(
            this.strokes.map((stroke) => stroke.points)
        ),
      };

      this.selected = true;

      this.selecting = false;

    } else {
      this.selecting = true;

      this.startPosition = this.currentPosition;

      if (this.strokes.length > 0) {
        this.anchor = this.currentPosition;

        this.previousStroke = [...this.previousStroke, ...this.strokes,];
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
        if ( this.pathFinder && this.startPosition ) {
          const pathCoords = this.pathFinder.find(
              getIdx(this.downsizedWidth, 1)(
                  Math.floor(this.startPosition.x *this.scalingFactor),
                  Math.floor(this.startPosition.y * this.scalingFactor),
                  0
              ),
              getIdx(this.downsizedWidth, 1)(
                  Math.floor(this.currentPosition.x * this.scalingFactor),
                  Math.floor(this.currentPosition.y * this.scalingFactor),
                  0
              )
          );

          this.strokes = transformCoordinatesToStrokes(pathCoords);
        }
      }
  };

  onMouseUp(position: { x: number; y: number }) {
    if (this.selected || !this.selecting) {
      return;
    }

    this.currentPosition = position;

    if (this.magnetConnected(this.currentPosition)) {
      if (this.startPosition) {
        const stroke = {
          points: [
            this.currentPosition.x,
            this.currentPosition.y,
            this.startPosition.x,
            this.startPosition.y,
          ],
        };

        this.strokes = [...this.strokes, stroke];
      }

      const stroke = {
        points: _.flatten(
            this.strokes.map((stroke) => stroke.points)
        ),
      };

      this.selected = true;

      this.selecting = false;

      this.annotation = stroke;

      this.strokes = [];
    } else {
      if (this.strokes.length > 0) {
        this.anchor = position;

        this.startPosition = this.currentPosition;

        this.previousStroke = [...this.previousStroke, ...this.strokes];
      } else {
        this.startPosition = this.currentPosition;
      }
    }
  };

  select(category: number) {
    if (!this.image) {
      console.log("Error: no image");
      return
    }
    if (!this.graph) {
      console.log("Creating graph");
      const grey = this.image!.grey();
      const edges = grey.sobelFilter();
      this.downsizedWidth = this.image!.width * this.scalingFactor;
      const downsized = edges.resize({factor: this.scalingFactor});
      this.graph = makeGraph(downsized.data, downsized.height, downsized.width);
      console.log("Creating pathfinder");
      this.pathFinder = createPathFinder(
        this.graph,
        this.downsizedWidth,
        this.scalingFactor,
      );
    }

    if (!this.boundingBox || !this.mask) return;
    this.selection = {
      boundingBox: this.boundingBox,
      categoryId: category,
      mask: this.mask,
    };

  }

  magnetConnected(position: { x: number; y: number })  {
    const inside = this.isInside(magneticSelectionStartingAnchorCircleRef, position);
    if (this.strokes && this.strokes.length > 0) {
      return inside && this.canClose;
    }
  };

}
