import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "../../types/CategoryType";
import { ImageType } from "../../types/ImageType";
import { ToolType } from "../../types/ToolType";
import { AnnotationType } from "../../types/AnnotationType";
import { AnnotationModeType } from "../../types/AnnotationModeType";
import { StateType } from "../../types/StateType";
import { ZoomModeType } from "../../types/ZoomModeType";
import * as _ from "lodash";
import colorImage from "../../images/cell-painting.png";
import { LanguageType } from "../../types/LanguageType";
import * as tensorflow from "@tensorflow/tfjs";

const initialState: StateType = {
  annotated: false,
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
  toolType: ToolType.RectangularAnnotation,
  penSelectionBrushSize: 2,
  saturation: 0,
  selectedCategory: "00000000-0000-0000-0000-000000000000",
  selectionMode: AnnotationModeType.New,
  soundEnabled: true,
  vibrance: 0,
  zoomSettings: {
    automaticCentering: false,
    mode: ZoomModeType.In,
    toActualSize: false,
    toFit: false,
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
    setSelectedAnnotation(
      state: StateType,
      action: PayloadAction<{ selectedAnnotation: string | undefined }>
    ) {
      state.selectedAnnotation = action.payload.selectedAnnotation;
    },
    setSelectionMode(
      state: StateType,
      action: PayloadAction<{ selectionMode: AnnotationModeType }>
    ) {
      state.selectionMode = action.payload.selectionMode;
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
  setAnnotated,
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
  setOperation,
  setPenSelectionBrushSize,
  setSaturation,
  setSelectedAnnotation,
  setSelectionMode,
  setSeletedCategory,
  setSoundEnabled,
  setVibrance,
} = applicationSlice.actions;
