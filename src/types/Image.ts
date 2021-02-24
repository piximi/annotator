import { Shape } from "./Shape";
import { Selection } from "./ImageViewerSelection";

export type Image = {
  categoryId?: string;
  id: string;
  name: string;
  src: string;
  shape?: Shape;
  instances: Array<Selection>;
};
