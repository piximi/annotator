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
import { HistoryStateType } from "../../types/HistoryStateType";

const initialState: HistoryStateType = {
  future: [],
  past: [],
  present: {
    annotated: false,
    annotating: true,
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
    penSelectionBrushSize: 2,
    saturation: 0,
    selectedCategory: "00000000-0000-0000-0000-000000000000",
    selectionMode: AnnotationModeType.New,
    soundEnabled: true,
    stageHeight: 1000,
    stageScale: 1,
    stageWidth: 1000,
    toolType: ToolType.RectangularAnnotation,
    vibrance: 0,
    zoomSelection: {
      dragging: false,
      minimum: undefined,
      maximum: undefined,
      selecting: false,
    },
  },
};

export const applicationSlice = createSlice({
  initialState: initialState,
  name: "image-viewer-application",
  reducers: {
    deleteCategory(
      state: HistoryStateType,
      action: PayloadAction<{ category: CategoryType }>
    ) {
      state.present.categories = state.present.categories.filter(
        (category: CategoryType) => category.id !== action.payload.category.id
      );
    },
    deleteImageInstance(
      state: HistoryStateType,
      action: PayloadAction<{ id: string }>
    ) {
      if (!state.present.image) return;

      state.present.image.annotations = state.present.image.annotations.filter(
        (instance: AnnotationType) => instance.id !== action.payload.id
      );
    },
    replaceImageInstance(
      state: HistoryStateType,
      action: PayloadAction<{ id: string; instance: AnnotationType }>
    ) {
      if (!state.present.image) return;

      const instances = state.present.image.annotations.filter(
        (instance: AnnotationType) => instance.id !== action.payload.id
      );

      state.present.image.annotations = [...instances, action.payload.instance];
    },
    setAnnotated(
      state: HistoryStateType,
      action: PayloadAction<{ annotated: boolean }>
    ) {
      state.present.annotated = action.payload.annotated;
    },
    setBoundingClientRect(
      state: HistoryStateType,
      action: PayloadAction<{ boundingClientRect: DOMRect }>
    ) {
      state.present.boundingClientRect = action.payload.boundingClientRect;
    },
    setBrightness(
      state: HistoryStateType,
      action: PayloadAction<{ brightness: number }>
    ) {
      state.present.brightness = action.payload.brightness;
    },
    setCategories(
      state: HistoryStateType,
      action: PayloadAction<{ categories: Array<CategoryType> }>
    ) {
      state.present.categories = action.payload.categories;
    },
    setCategoryVisibility(
      state: HistoryStateType,
      action: PayloadAction<{ category: CategoryType; visible: boolean }>
    ) {
      const category = _.find(state.present.categories, (category) => {
        return category.id === action.payload.category.id;
      });
      if (!category) return;
      category.visible = action.payload.visible;
      state.present.categories = [
        ...state.present.categories.filter((category) => {
          return category.id !== action.payload.category.id;
        }),
        category,
      ];
    },
    setContrast(
      state: HistoryStateType,
      action: PayloadAction<{ contrast: number }>
    ) {
      state.present.contrast = action.payload.contrast;
    },
    setExposure(
      state: HistoryStateType,
      action: PayloadAction<{ exposure: number }>
    ) {
      state.present.exposure = action.payload.exposure;
    },
    setHue(state: HistoryStateType, action: PayloadAction<{ hue: number }>) {
      state.present.hue = action.payload.hue;
    },
    setImage(
      state: HistoryStateType,
      action: PayloadAction<{ image: ImageType }>
    ) {
      state.present.image = action.payload.image;
    },
    setImageInstances(
      state: HistoryStateType,
      action: PayloadAction<{ instances: Array<AnnotationType> }>
    ) {
      if (!state.present.image) return;
      state.present.image.annotations = action.payload.instances;
    },
    setImageName(
      state: HistoryStateType,
      action: PayloadAction<{ name: string }>
    ) {
      if (!state.present.image) return;

      state.present.image.name = action.payload.name;
    },
    setInvertMode(
      state: HistoryStateType,
      action: PayloadAction<{ invertMode: boolean }>
    ) {
      state.present.invertMode = action.payload.invertMode;
    },
    setLanguage(
      state: HistoryStateType,
      action: PayloadAction<{ language: LanguageType }>
    ) {
      state.present.language = action.payload.language;
    },
    setOffset(
      state: HistoryStateType,
      action: PayloadAction<{ offset: { x: number; y: number } }>
    ) {
      state.present.offset = action.payload.offset;
    },
    setOperation(
      state: HistoryStateType,
      action: PayloadAction<{ operation: ToolType }>
    ) {
      state.present.toolType = action.payload.operation;
    },
    setPenSelectionBrushSize(
      state: HistoryStateType,
      action: PayloadAction<{ penSelectionBrushSize: number }>
    ) {
      state.present.penSelectionBrushSize =
        action.payload.penSelectionBrushSize;
    },
    setSaturation(
      state: HistoryStateType,
      action: PayloadAction<{ saturation: number }>
    ) {
      state.present.saturation = action.payload.saturation;
    },
    setSeletedCategory(
      state: HistoryStateType,
      action: PayloadAction<{ selectedCategory: string }>
    ) {
      state.present.selectedCategory = action.payload.selectedCategory;
    },
    setSelectedAnnotation(
      state: HistoryStateType,
      action: PayloadAction<{ selectedAnnotation: string | undefined }>
    ) {
      state.present.selectedAnnotation = action.payload.selectedAnnotation;
    },
    setSelectionMode(
      state: HistoryStateType,
      action: PayloadAction<{ selectionMode: AnnotationModeType }>
    ) {
      state.present.selectionMode = action.payload.selectionMode;
    },
    setStageHeight(
      state: HistoryStateType,
      action: PayloadAction<{ stageHeight: number }>
    ) {
      state.present.stageHeight = action.payload.stageHeight;
    },
    setStageScale(
      state: HistoryStateType,
      action: PayloadAction<{ stageScale: number }>
    ) {
      state.present.stageScale = action.payload.stageScale;
    },
    setStageWidth(
      state: HistoryStateType,
      action: PayloadAction<{ stageWidth: number }>
    ) {
      state.present.stageWidth = action.payload.stageWidth;
    },
    setSoundEnabled(
      state: HistoryStateType,
      action: PayloadAction<{ soundEnabled: boolean }>
    ) {
      state.present.soundEnabled = action.payload.soundEnabled;
    },
    setVibrance(
      state: HistoryStateType,
      action: PayloadAction<{ vibrance: number }>
    ) {
      state.present.vibrance = action.payload.vibrance;
    },
    setZoomSelection(
      state: HistoryStateType,
      action: PayloadAction<{
        zoomSelection: {
          dragging: boolean;
          minimum: { x: number; y: number } | undefined;
          maximum: { x: number; y: number } | undefined;
          selecting: boolean;
        };
      }>
    ) {
      state.present.zoomSelection = action.payload.zoomSelection;
    },
  },
  extraReducers: {
    ["thunks/loadLayersModel/fulfilled"]: (
      state: HistoryStateType,
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
  setAnnotated,
  setBoundingClientRect,
  setBrightness,
  setCategories,
  setCategoryVisibility,
  setContrast,
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
  setSelectedAnnotation,
  setSelectionMode,
  setSeletedCategory,
  setSoundEnabled,
  setStageHeight,
  setStageScale,
  setStageWidth,
  setVibrance,
  setZoomSelection,
} = applicationSlice.actions;
