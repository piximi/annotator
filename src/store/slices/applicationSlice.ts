import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "../../types/CategoryType";
import { ImageType } from "../../types/ImageType";
import { ToolType } from "../../types/ToolType";
import { AnnotationType } from "../../types/AnnotationType";
import { AnnotationModeType } from "../../types/AnnotationModeType";
import * as _ from "lodash";
import colorImage from "../../images/cell-painting.png";
import { LanguageType } from "../../types/LanguageType";
import * as tensorflow from "@tensorflow/tfjs";
import { StateType } from "../../types/StateType";
import { SerializedAnnotationType } from "../../types/SerializedAnnotationType";
import { decode } from "../../image/rle";
import { computeContours } from "../../image/imageHelper";

const initialState: StateType = {
  annotated: false,
  annotating: false,
  boundingClientRect: new DOMRect(),
  brightness: 0,
  categories: [
    {
      color: "#AAAAAA",
      id: "00000000-0000-0000-0000-000000000000",
      name: "Unknown",
      visible: true,
    },
    {
      color: "#a08cd2",
      id: "00000000-0000-0000-0000-000000000001",
      name: "Cell membrane",
      visible: true,
    },
    {
      color: "#b8ddf3",
      id: "00000000-0000-0000-0000-000000000002",
      name: "Cell nucleus",
      visible: true,
    },
  ],
  currentIndex: 0,
  contrast: 0,
  exposure: 0,
  hue: 0,
  image: {
    id: "",
    annotations: [],
    name: "example.png",
    shape: {
      channels: 3,
      frames: 1,
      height: 512,
      planes: 1,
      width: 512,
    },
    originalSrc: colorImage,
    src: colorImage,
  },
  intensityRange: [
    [0, 255],
    [0, 255],
    [0, 255],
  ],
  invertMode: false,
  language: LanguageType.English,
  offset: { x: 0, y: 0 },
  penSelectionBrushSize: 32,
  pointerSelection: {
    dragging: false,
    minimum: undefined,
    maximum: undefined,
    selecting: false,
  },
  quickSelectionBrushSize: 40,
  saturation: 0,
  selectedAnnotation: undefined,
  selectedAnnotations: [],
  selectedCategory: "00000000-0000-0000-0000-000000000000",
  selectionMode: AnnotationModeType.New,
  soundEnabled: true,
  stageHeight: 1000,
  stageScale: 1,
  stageWidth: 1000,
  stagePosition: { x: 0, y: 0 },
  toolType: ToolType.RectangularAnnotation,
  vibrance: 0,
  zoomSelection: {
    dragging: false,
    minimum: undefined,
    maximum: undefined,
    selecting: false,
  },
};

export const applicationSlice = createSlice({
  initialState: initialState,
  name: "image-viewer-application",
  reducers: {
    deleteCategory(
      state: StateType,
      action: PayloadAction<{ category: CategoryType }>
    ) {
      state.categories = state.categories.filter(
        (category: CategoryType) => category.id !== action.payload.category.id
      );
    },
    deleteImageInstance(
      state: StateType,
      action: PayloadAction<{ id: string }>
    ) {
      if (!state.image) return;

      state.image.annotations = state.image.annotations.filter(
        (instance: AnnotationType) => instance.id !== action.payload.id
      );
    },
    openAnnotations(
      state: StateType,
      action: PayloadAction<{ annotations: Array<SerializedAnnotationType> }>
    ) {
      /*
       * NOTE: Users are expected to open their image before opening the
       * corresponding annotations. -- Allen
       */
      if (!state.image) return;

      state.image.annotations = action.payload.annotations.map(
        (annotation: SerializedAnnotationType): AnnotationType => {
          const mask = annotation.annotationMask
            .split(" ")
            .map((x: string) => parseInt(x));

          const decoded = _.map(
            _.chunk(decode(mask), state.image?.shape.width),
            (el: Array<number>) => {
              return Array.from(el);
            }
          );

          const contour = computeContours(decoded);

          //if category does not already exist in state, add it
          if (
            !state.categories
              .map((category: CategoryType) => category.id)
              .includes(annotation.annotationCategoryId)
          ) {
            const category: CategoryType = {
              color: annotation.annotationCategoryColor,
              id: annotation.annotationCategoryId,
              name: annotation.annotationCategoryName,
              visible: true,
            };
            state.categories = [...state.categories, category];
          }

          return {
            boundingBox: [
              annotation.annotationBoundingBoxX,
              annotation.annotationBoundingBoxY,
              annotation.annotationBoundingBoxWidth,
              annotation.annotationBoundingBoxHeight,
            ],
            categoryId: annotation.annotationCategoryId,
            contour: contour,
            id: annotation.annotationId,
            mask: mask,
          };
        }
      );
    },
    replaceImageInstance(
      state: StateType,
      action: PayloadAction<{ id: string; instance: AnnotationType }>
    ) {
      if (!state.image) return;

      const instances = state.image.annotations.filter(
        (instance: AnnotationType) => instance.id !== action.payload.id
      );

      state.image.annotations = [...instances, action.payload.instance];
    },
    setAnnotated(
      state: StateType,
      action: PayloadAction<{ annotated: boolean }>
    ) {
      state.annotated = action.payload.annotated;
    },
    setAnnotating(
      state: StateType,
      action: PayloadAction<{ annotating: boolean }>
    ) {
      state.annotating = action.payload.annotating;
    },
    setBoundingClientRect(
      state: StateType,
      action: PayloadAction<{ boundingClientRect: DOMRect }>
    ) {
      state.boundingClientRect = action.payload.boundingClientRect;
    },
    setBrightness(
      state: StateType,
      action: PayloadAction<{ brightness: number }>
    ) {
      state.brightness = action.payload.brightness;
    },
    setCategories(
      state: StateType,
      action: PayloadAction<{ categories: Array<CategoryType> }>
    ) {
      state.categories = action.payload.categories;
    },
    setCategoryVisibility(
      state: StateType,
      action: PayloadAction<{ category: CategoryType; visible: boolean }>
    ) {
      const category = _.find(state.categories, (category) => {
        return category.id === action.payload.category.id;
      });
      if (!category) return;
      category.visible = action.payload.visible;
      state.categories = [
        ...state.categories.filter((category) => {
          return category.id !== action.payload.category.id;
        }),
        category,
      ];
    },
    setContrast(state: StateType, action: PayloadAction<{ contrast: number }>) {
      state.contrast = action.payload.contrast;
    },
    setCurrentIndex(
      state: StateType,
      action: PayloadAction<{ currentIndex: number }>
    ) {
      state.currentIndex = action.payload.currentIndex;
    },
    setExposure(state: StateType, action: PayloadAction<{ exposure: number }>) {
      state.exposure = action.payload.exposure;
    },
    setHue(state: StateType, action: PayloadAction<{ hue: number }>) {
      state.hue = action.payload.hue;
    },
    setImage(state: StateType, action: PayloadAction<{ image: ImageType }>) {
      state.image = action.payload.image;
    },
    setImageInstances(
      state: StateType,
      action: PayloadAction<{ instances: Array<AnnotationType> }>
    ) {
      if (!state.image) return;
      state.image.annotations = action.payload.instances;
    },
    setImageName(state: StateType, action: PayloadAction<{ name: string }>) {
      if (!state.image) return;

      state.image.name = action.payload.name;
    },
    setImageSrc(state: StateType, action: PayloadAction<{ src: string }>) {
      if (!state.image) return;
      state.image.src = action.payload.src;
    },
    setIntensityRange(
      state: StateType,
      action: PayloadAction<{
        intensityRange: Array<Array<number>>;
      }>
    ) {
      state.intensityRange = action.payload.intensityRange;
    },
    setInvertMode(
      state: StateType,
      action: PayloadAction<{ invertMode: boolean }>
    ) {
      state.invertMode = action.payload.invertMode;
    },
    setLanguage(
      state: StateType,
      action: PayloadAction<{ language: LanguageType }>
    ) {
      state.language = action.payload.language;
    },
    setOffset(
      state: StateType,
      action: PayloadAction<{ offset: { x: number; y: number } }>
    ) {
      state.offset = action.payload.offset;
    },
    setOperation(
      state: StateType,
      action: PayloadAction<{ operation: ToolType }>
    ) {
      state.toolType = action.payload.operation;
    },
    setPenSelectionBrushSize(
      state: StateType,
      action: PayloadAction<{ penSelectionBrushSize: number }>
    ) {
      state.penSelectionBrushSize = action.payload.penSelectionBrushSize;
    },
    setPointerSelection(
      state: StateType,
      action: PayloadAction<{
        pointerSelection: {
          dragging: boolean;
          minimum: { x: number; y: number } | undefined;
          maximum: { x: number; y: number } | undefined;
          selecting: boolean;
        };
      }>
    ) {
      state.pointerSelection = action.payload.pointerSelection;
    },
    setQuickSelectionBrushSize(
      state: StateType,
      action: PayloadAction<{ quickSelectionBrushSize: number }>
    ) {
      state.quickSelectionBrushSize = action.payload.quickSelectionBrushSize;
    },
    setSaturation(
      state: StateType,
      action: PayloadAction<{ saturation: number }>
    ) {
      state.saturation = action.payload.saturation;
    },
    setSeletedCategory(
      state: StateType,
      action: PayloadAction<{ selectedCategory: string }>
    ) {
      state.selectedCategory = action.payload.selectedCategory;
    },
    setSelectedAnnotation(
      state: StateType,
      action: PayloadAction<{ selectedAnnotation: AnnotationType | undefined }>
    ) {
      state.selectedAnnotation = action.payload.selectedAnnotation;
    },
    setSelectedAnnotations(
      state: StateType,
      action: PayloadAction<{ selectedAnnotations: Array<AnnotationType> }>
    ) {
      state.selectedAnnotations = action.payload.selectedAnnotations;
    },
    setSelectionMode(
      state: StateType,
      action: PayloadAction<{ selectionMode: AnnotationModeType }>
    ) {
      state.selectionMode = action.payload.selectionMode;
    },
    setStageHeight(
      state: StateType,
      action: PayloadAction<{ stageHeight: number }>
    ) {
      state.stageHeight = action.payload.stageHeight;
    },
    setStagePosition(
      state: StateType,
      action: PayloadAction<{ stagePosition: { x: number; y: number } }>
    ) {
      state.stagePosition = action.payload.stagePosition;
    },
    setStageScale(
      state: StateType,
      action: PayloadAction<{ stageScale: number }>
    ) {
      state.stageScale = action.payload.stageScale;
    },
    setStageWidth(
      state: StateType,
      action: PayloadAction<{ stageWidth: number }>
    ) {
      state.stageWidth = action.payload.stageWidth;
    },
    setSoundEnabled(
      state: StateType,
      action: PayloadAction<{ soundEnabled: boolean }>
    ) {
      state.soundEnabled = action.payload.soundEnabled;
    },
    setVibrance(state: StateType, action: PayloadAction<{ vibrance: number }>) {
      state.vibrance = action.payload.vibrance;
    },
    setZoomSelection(
      state: StateType,
      action: PayloadAction<{
        zoomSelection: {
          dragging: boolean;
          minimum: { x: number; y: number } | undefined;
          maximum: { x: number; y: number } | undefined;
          selecting: boolean;
        };
      }>
    ) {
      state.zoomSelection = action.payload.zoomSelection;
    },
  },
  extraReducers: {
    ["thunks/loadLayersModel/fulfilled"]: (
      state: StateType,
      action: PayloadAction<tensorflow.LayersModel>
    ) => {
      console.info(action.payload);
    },
  },
});

export const {
  deleteCategory,
  deleteImageInstance,
  replaceImageInstance,
  setAnnotating,
  setAnnotated,
  setBoundingClientRect,
  setBrightness,
  setCategories,
  setCategoryVisibility,
  setContrast,
  setCurrentIndex,
  setExposure,
  setHue,
  setImage,
  setImageInstances,
  setImageName,
  setIntensityRange,
  setInvertMode,
  setLanguage,
  setOffset,
  setOperation,
  setPenSelectionBrushSize,
  setPointerSelection,
  setQuickSelectionBrushSize,
  setSaturation,
  setSelectedAnnotation,
  setSelectedAnnotations,
  setSelectionMode,
  setSeletedCategory,
  setSoundEnabled,
  setStageHeight,
  setStagePosition,
  setStageScale,
  setStageWidth,
  setVibrance,
  setZoomSelection,
} = applicationSlice.actions;
