import { CategoryType } from "./CategoryType";
import { ImageType } from "./ImageType";
import { ToolType } from "./ToolType";
import { SelectionMode } from "./SelectionMode";
import { ZoomSettings } from "./ZoomSettings";
import { Language } from "./Language";

export type StateType = {
  annotated: boolean;
  brightness: number;
  categories: Array<CategoryType>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: ImageType;
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
