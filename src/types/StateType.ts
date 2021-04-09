import { CategoryType } from "./CategoryType";
import { ImageType } from "./ImageType";
import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { LanguageType } from "./LanguageType";

export type StateType = {
  annotated: boolean;
  boundingClientRect: DOMRect;
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
  zoomSelection: {
    dragging: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
    selecting: boolean;
  };
};
