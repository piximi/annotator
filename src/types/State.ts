import { Category } from "./Category";
import { Image } from "./Image";
import { ToolType } from "./ToolType";
import { SelectionMode } from "./SelectionMode";
import { ZoomSettings } from "./ZoomSettings";

export type State = {
  brightness: number;
  categories: Array<Category>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  invertMode: boolean;
  penSelectionBrushSize: number;
  saturation: number;
  selectedAnnotation?: string;
  selectedCategory: string;
  selectionMode: SelectionMode;
  toolType: ToolType;
  vibrance: number;
  zoomSettings: ZoomSettings;
};
