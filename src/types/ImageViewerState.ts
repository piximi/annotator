import { Image } from "./Image";
import { ImageViewerOperation } from "./ImageViewerOperation";
import { ImageViewerSelectionMode } from "./ImageViewerSelectionMode";
import { ImageViewerZoomMode } from "./ImageViewerZoomMode";

export type ImageViewerState = {
  brightness: number;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  operation: ImageViewerOperation;
  saturation: number;
  selectionMode: ImageViewerSelectionMode;
  vibrance: number;
  zoomMode: ImageViewerZoomMode;
};
