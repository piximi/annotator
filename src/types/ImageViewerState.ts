import { Image } from "./Image";
import { ImageViewerOperation } from "./ImageViewerOperation";
import { ImageViewerSelectionMode } from "./ImageViewerSelectionMode";
import { ImageViewerZoomMode } from "./ImageViewerZoomMode";
import { Category } from "./Category";

export type ImageViewerState = {
  brightness: number;
  categories: Array<Category>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  operation: ImageViewerOperation;
  saturation: number;
  selectedCategoryId: string;
  selectionMode: ImageViewerSelectionMode;
  vibrance: number;
  zoomMode: ImageViewerZoomMode;
};
