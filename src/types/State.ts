import { Category } from "./Category";
import { Image } from "./Image";
import { Tool } from "./Tool";
import { SelectionMode } from "./SelectionMode";
import { ZoomMode } from "./ZoomMode";

export type State = {
  brightness: number;
  categories: Array<Category>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  invertMode: boolean;
  operation: Tool;
  penSelectionBrushSize: number;
  saturation: number;
  selectedCategory: string;
  selectionMode: SelectionMode;
  vibrance: number;
  zoomMode: ZoomMode;
  zoomReset: boolean;
};
