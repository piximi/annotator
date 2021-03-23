import { Category } from "./Category";
import { Image } from "./Image";
import { ToolType } from "./ToolType";
import { SelectionMode } from "./SelectionMode";
import { ZoomSettings } from "./ZoomSettings";
import { Language } from "./Language";

export type State = {
  annotated: boolean;
  brightness: number;
  categories: Array<Category>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: Image;
  invertMode: boolean;
  language: Language;
  penSelectionBrushSize: number;
  saturation: number;
  selectedAnnotation?: string;
  selectedCategory: string;
  selectionMode: SelectionMode;
  soundEnabled: boolean;
  toolType: ToolType;
  vibrance: number;
  zoomSettings: ZoomSettings;
};
