import { ImageViewerSelection } from "../../types/ImageViewerSelection";
import * as ImageJS from "image-js";
import { Category } from "../../types/Category";

export abstract class SelectionOperator {
  image: ImageJS.Image;
  manager: ImageJS.RoiManager;
  selected: boolean = false;
  selecting: boolean = false;
  selection?: ImageViewerSelection;

  constructor(image: ImageJS.Image) {
    this.image = image;

    this.manager = image.getRoiManager();
  }

  abstract get boundingBox(): [number, number, number, number] | undefined;

  abstract get mask(): string | undefined;

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  abstract select(category: Category): void;
}
