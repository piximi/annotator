import { CategoryType } from "./CategoryType";
import { ImageType } from "./ImageType";
import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { ZoomToolOptionsType } from "./ZoomToolOptionsType";
import { LanguageType } from "./LanguageType";

export type StateType = {
  annotated: boolean;
  brightness: number;
  categories: Array<CategoryType>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: ImageType;
  invertMode: boolean;
  language: LanguageType;
  penSelectionBrushSize: number;
  saturation: number;
  selectedAnnotation?: string;
  selectedCategory: string;
  selectionMode: AnnotationModeType;
  soundEnabled: boolean;
  toolType: ToolType;
  vibrance: number;
  zoomSettings: ZoomToolOptionsType;
};
