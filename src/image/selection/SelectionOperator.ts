import { ImageViewerSelection } from "../../types/ImageViewerSelection";
import * as ImageJS from "image-js";

export abstract class SelectionOperator {
  image?: ImageJS.Image;

  selected: boolean = false;

  selecting: boolean = false;

  selection?: ImageViewerSelection;

  constructor(image?: ImageJS.Image) {
    if (image) this.image = image;
  }

  abstract get box(): [number, number, number, number] | undefined;

  abstract get mask(): string | undefined;

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  abstract select(category: number): void;
}
