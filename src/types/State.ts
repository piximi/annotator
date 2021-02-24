import { Image } from "./Image";
import { Operation } from "./ImageViewerOperation";
import { SelectionMode } from "./ImageViewerSelectionMode";
import { ZoomMode } from "./ImageViewerZoomMode";
import { Category } from "./Category";

export type State = {
  brightness: number;
  categories: Array<Category>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  operation: Operation;
  saturation: number;
  selectedCategoryId: string;
  selectionMode: SelectionMode;
  vibrance: number;
  zoomMode: ZoomMode;
};
