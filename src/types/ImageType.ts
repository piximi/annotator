import { ShapeType } from "./ShapeType";
import { AnnotationType } from "./AnnotationType";

export type ImageType = {
  categoryId?: string;
  id: string;
  annotations: Array<AnnotationType>;
  name: string;
  shape: ShapeType;
  src: string; // original image data
  displayedSrc?: string; // filtered image data
};
