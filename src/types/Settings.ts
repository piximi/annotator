import { ImageViewerOperation } from "./ImageViewerOperation";

export type Settings = {
  tileSize: number;
  selectedImages: Array<string>;
  selectionMethod: ImageViewerOperation;
};
