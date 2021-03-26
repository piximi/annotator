import { AnnotationTool } from "../AnnotationTool";
import { createPathFinder, makeGraph, PiximiGraph } from "../../../GraphHelper";
import { getIdx } from "../../../imageHelper";
import * as ImageJS from "image-js";
import * as _ from "lodash";

export class MagneticAnnotationTool extends AnnotationTool {
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

  constructor(
    image: ImageJS.Image,
    factor: number = 0.5,
    stagedImageShape: { width: number; height: number }
  ) {
    super(image, stagedImageShape);

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

  deselect() {
    this.annotated = false;
    this.annotating = false;

    this.annotation = undefined;

    this.anchor = undefined;
    this.buffer = [];
    this.graph = undefined;
    this.origin = undefined;
    this.points = [];
    this.previous = [];
  }

  onMouseDown(position: { x: number; y: number }) {
    if (this.annotated) return;

    if (this.connected(position)) {
      if (this.origin) {
        const translatedOrigin = this.toImageSpace(this.origin);
        this.buffer = [...this.buffer, translatedOrigin.x, translatedOrigin.y];
      }

      this.annotated = true;
      this.annotating = false;

      this.points = this.buffer;

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);
    }

    if (this.buffer && this.buffer.length === 0) {
      this.annotating = true;

      if (!this.origin) {
        this.origin = position;
      }
    }
  }

  onMouseMove(position: { x: number; y: number }) {
    if (!this.image || !this.pathfinder || this.annotated || !this.annotating)
      return;

    const translatedPosition = this.toImageSpace(position);

    if (this.anchor) {
      const translatedAnchor = this.toImageSpace(this.anchor);

      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedAnchor.x * this.factor),
        Math.floor(translatedAnchor.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedPosition.x * this.factor),
        Math.floor(translatedPosition.y * this.factor),
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
        translatedAnchor.x,
        translatedAnchor.y,
        ...this.path,
      ];

      return;
    }

    if (this.origin) {
      const translatedOrigin = this.toImageSpace(this.origin);

      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedOrigin.x * this.factor),
        Math.floor(translatedOrigin.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedPosition.x * this.factor),
        Math.floor(translatedPosition.y * this.factor),
        0
      );

      this.path = _.flatten(this.pathfinder.find(source, destination));

      this.buffer.pop();
      this.buffer.pop();

      this.buffer = [translatedOrigin.x, translatedOrigin.y, ...this.path];
    }
  }

  onMouseUp(position: { x: number; y: number }) {
    if (this.annotated || !this.annotating) return;

    if (
      this.connected(position) &&
      this.origin &&
      this.buffer &&
      this.buffer.length > 0
    ) {
      const translatedPosition = this.toImageSpace(position);
      const translatedOrigin = this.toImageSpace(this.origin);

      this.buffer = [
        ...this.buffer,
        translatedPosition.x,
        translatedPosition.y,
        translatedOrigin.x,
        translatedOrigin.y,
      ];

      this.annotated = true;
      this.annotating = false;

      this.points = this.buffer;

      this._contour = this.points;
      this._mask = this.computeMask();
      this._boundingBox = this.computeBoundingBoxFromContours(this._contour);

      this.buffer = [];

      return;
    }

    if (this.anchor && this.image) {
      const translatedAnchor = this.toImageSpace(this.anchor);

      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedAnchor.x * this.factor),
        Math.floor(translatedAnchor.y * this.factor),
        0
      );

      const translatedPosition = this.toImageSpace(position);

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedPosition.x * this.factor),
        Math.floor(translatedPosition.y * this.factor),
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

      const translatedOrigin = this.toImageSpace(this.origin);

      this.anchor = position;

      const translatedPosition = this.toImageSpace(position);

      const source = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedOrigin.x * this.factor),
        Math.floor(translatedOrigin.y * this.factor),
        0
      );

      const destination = getIdx(this.image.width * this.factor, 1)(
        Math.floor(translatedPosition.x * this.factor),
        Math.floor(translatedPosition.y * this.factor),
        0
      );

      this.path = _.flatten(this.pathfinder.find(source, destination));

      this.buffer = [translatedOrigin.x, translatedOrigin.y, ...this.path];

      this.previous = [
        ...this.previous,
        translatedOrigin.x,
        translatedOrigin.y,
        ...this.path,
      ];

      return;
    }
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
