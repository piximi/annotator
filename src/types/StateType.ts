import { CategoryType } from "./CategoryType";
import { ImageType } from "./ImageType";
import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { LanguageType } from "./LanguageType";
import { AnnotationType } from "./AnnotationType";

export type StateType = {
  annotated: boolean;
  annotating: boolean;
  boundingClientRect: DOMRect;
  brightness: number;
  categories: Array<CategoryType>;
  contrast: number;
  currentIndex: number;
  currentPosition?: { x: number; y: number };
  exposure: number;
  hue: number;
  image?: ImageType;
  invertMode: boolean;
  language: LanguageType;
  offset: { x: number; y: number };
  penSelectionBrushSize: number;
  pointerSelection: {
    selecting: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
  };
  quickSelectionBrushSize: number;
  saturation: number;
  selectedAnnotations: Array<AnnotationType>;
  selectedAnnotation: AnnotationType | undefined;
  selectedCategory: string;
  selectionMode: AnnotationModeType;
  soundEnabled: boolean;
  stageHeight: number;
  stageScale: number;
  stageWidth: number;
  stagePosition: { x: number; y: number };
  toolType: ToolType;
  vibrance: number;
  zoomSelection: {
    dragging: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
    selecting: boolean;
  };
};
