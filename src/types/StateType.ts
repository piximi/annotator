import { CategoryType } from "./CategoryType";
import { ImageType } from "./ImageType";
import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { LanguageType } from "./LanguageType";

export type StateType = {
  annotated: boolean;
  boundingClientRectWidth: number;
  brightness: number;
  categories: Array<CategoryType>;
  contrast: number;
  exposure: number;
  hue: number;
  image?: ImageType;
  invertMode: boolean;
  language: LanguageType;
  offset: { x: number; y: number };
  penSelectionBrushSize: number;
  saturation: number;
  selectedAnnotation?: string;
  selectedCategory: string;
  selectionMode: AnnotationModeType;
  soundEnabled: boolean;
  stageHeight: number;
  stageScale: number;
  stageWidth: number;
  toolType: ToolType;
  vibrance: number;
};
