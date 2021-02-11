import { BoundingBox } from "./BoundingBox";

export type Instance = {
  boundingBox: BoundingBox;
  categoryId?: string;
  contour: Array<number>;
  id: string;
  mask: string;
};
