import { BoundingBox } from "./BoundingBox";

export type Instance = {
  boundingBox: BoundingBox;
  categoryId?: string;
  contour: Array<number>;
  mask: any; //modify later
};
