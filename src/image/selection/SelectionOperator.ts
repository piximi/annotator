import { ImageViewerSelection } from "../../types/ImageViewerSelection";
import * as ImageJS from "image-js";
import React from "react";
import {Circle} from "konva/types/shapes/Circle";

export abstract class SelectionOperator {
  image?: ImageJS.Image;

  selected: boolean = false;

  selecting: boolean = false;

  selection?: ImageViewerSelection;

  constructor(image?: ImageJS.Image) {
    if (image) this.image = image;
  }

  abstract get boundingBox(): [number, number, number, number] | undefined;

  abstract get mask(): string | undefined;

  abstract deselect(): void;

  abstract onMouseDown(position: { x: number; y: number }): void;

  abstract onMouseMove(position: { x: number; y: number }): void;

  abstract onMouseUp(position: { x: number; y: number }): void;

  abstract select(category: number): void;

  isInside = (
    startingAnchorCircleRef: React.RefObject<Circle>,
    position: { x: number; y: number }
) => {
  if (
      startingAnchorCircleRef &&
      startingAnchorCircleRef.current
  ) {
    let rectangle = startingAnchorCircleRef.current.getClientRect();

    const transform = imageRef.current.getAbsoluteTransform().copy();
    transform.invert();
    const transformedRectangle = transform.point({
      x: rectangle.x,
      y: rectangle.y,
    });
    return (
        transformedRectangle.x <= position.x &&
        position.x <= transformedRectangle.x + rectangle.width &&
        transformedRectangle.y <= position.y &&
        position.y <= transformedRectangle.y + rectangle.height
    );
  } else {
    return false;
  }
  };

  }
