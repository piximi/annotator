export type AnnotationType = {
  boundingBox: [number, number, number, number];
  categoryId: string;
  contour: Array<number>;
  id: string;
  mask: Array<number>;
};
