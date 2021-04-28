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
  currentPosition: undefined,
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
    src: colorImage,
  },
  invertMode: false,
  language: LanguageType.English,
  offset: { x: 0, y: 0 },
  penSelectionBrushSize: 32,
  saturation: 0,
  selectedAnnotationId: undefined,
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
    setSelectedAnnotations(
      state: StateType,
      action: PayloadAction<{ selectedAnnotations: Array<AnnotationType> }>
    ) {
      state.selectedAnnotations = action.payload.selectedAnnotations;
    },
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
    setCurrentPosition(
      state: StateType,
      action: PayloadAction<{ currentPosition: { x: number; y: number } }>
    ) {
      state.currentPosition = action.payload.currentPosition;
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
    setSelectedAnnotationId(
      state: StateType,
      action: PayloadAction<{ selectedAnnotationId: string | undefined }>
    ) {
      state.selectedAnnotationId = action.payload.selectedAnnotationId;
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
  setCurrentPosition,
  setExposure,
  setHue,
  setImage,
  setImageInstances,
  setImageName,
  setInvertMode,
  setLanguage,
  setOffset,
  setOperation,
  setPenSelectionBrushSize,
  setSaturation,
  setSelectedAnnotationId,
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
