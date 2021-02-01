import { SelectionOperator } from "./SelectionOperator";
import {floodPixels, makeFloodMap} from "../flood";
import * as ImageJS from "image-js";
import {Category} from "../../types/Category";

export class ColorSelectionOperator extends SelectionOperator {
  categoryColor: string;
  overlayData: string = "";
  overlayImage: HTMLImageElement;
  initialPosition: { x: number; y: number } = {x: 0, y: 0};
  tolerance: number = 1;
  toleranceMap?: ImageJS.Image;

  constructor(color: string, image: ImageJS.Image) {
    super(image);
    this.overlayImage = new Image(image.width, image.height)
    this.categoryColor = color;
  }

  get boundingBox(): [number, number, number, number] | undefined {
    return undefined;
  }

  get mask(): string | undefined {
    return undefined;
  }

  deselect() {}

  onMouseDown(position: { x: number; y: number }) {
    this.selected = false;
    this.selecting = true;
    this.tolerance = 1;
    this.initialPosition = position;
    this.toleranceMap = makeFloodMap({
                  x: Math.floor(position.x),
                  y: Math.floor(position.y),
                  image: this.image!,
                })
    this.updateOverlay(position);
  };

  onMouseMove(position: { x: number; y: number }) {
    if (this.selecting) {
        const diff = Math.ceil(
            Math.hypot(
                position.x - this.initialPosition!.x,
                position.y - this.initialPosition!.y
            )
        );
        if (diff !== this.tolerance) {
          this.tolerance = diff;
          this.updateOverlay(this.initialPosition);
        }
    }
  };


  onMouseUp(position: { x: number; y: number }) {
    this.selected = true;
    this.selecting = false;
  }

  select(category: Category) {
    this.categoryColor = category.color;
  }

  private updateOverlay(position: { x: any; y: any }) {
    this.overlayData = floodPixels({
      x: Math.floor(position.x),
      y: Math.floor(position.y),
      image: this.toleranceMap!,
      tolerance: this.tolerance,
      color: this.categoryColor,
    });
    this.overlayImage.src = this.overlayData;
  };

}
