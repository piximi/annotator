import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/Category";
import { Image } from "../../types/Image";
import { ToolType } from "../../types/ToolType";
import { Selection } from "../../types/Selection";
import { SelectionMode } from "../../types/SelectionMode";
import { State } from "../../types/State";
import { ZoomMode } from "../../types/ZoomMode";
import * as _ from "lodash";
import colorImage from "../../images/cell-painting.png";
import { Language } from "../../types/Language";
import { loadLayersModelThunk } from "../thunks";
import * as tensorflow from "@tensorflow/tfjs";

const initialState: State = {
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
    instances: [],
    name: "example.png",
    shape: { c: 512, channels: 3, r: 512 },
    src: colorImage,
  },
  invertMode: false,
  language: Language.English,
  toolType: ToolType.RectangularSelection,
  penSelectionBrushSize: 2,
  saturation: 0,
  selectedCategory: "00000000-0000-0000-0000-000000000000",
  selectionMode: SelectionMode.New,
  soundEnabled: true,
  vibrance: 0,
  zoomSettings: {
    zoomAutomaticCentering: false,
    zoomMode: ZoomMode.In,
    zoomReset: false,
  },
};

export const slice = createSlice({
  initialState: initialState,
  name: "image-viewer",
  reducers: {
    deleteCategory(
      state: State,
      action: PayloadAction<{ category: Category }>
    ) {
      state.categories = state.categories.filter(
        (category: Category) => category.id !== action.payload.category.id
      );
    },
    deleteImageInstance(state: State, action: PayloadAction<{ id: string }>) {
      if (!state.image) return;

      state.image.instances = state.image.instances.filter(
        (instance: Selection) => instance.id !== action.payload.id
      );
    },
    replaceImageInstance(
      state: State,
      action: PayloadAction<{ id: string; instance: Selection }>
    ) {
      if (!state.image) return;

      const instances = state.image.instances.filter(
        (instance: Selection) => instance.id !== action.payload.id
      );

      state.image.instances = [...instances, action.payload.instance];
    },
    setAnnotated(state: State, action: PayloadAction<{ annotated: boolean }>) {
      state.annotated = action.payload.annotated;
    },
    setBrightness(state: State, action: PayloadAction<{ brightness: number }>) {
      state.brightness = action.payload.brightness;
    },
    setCategories(
      state: State,
      action: PayloadAction<{ categories: Array<Category> }>
    ) {
      state.categories = action.payload.categories;
    },
    setCategoryVisibility(
      state: State,
      action: PayloadAction<{ category: Category; visible: boolean }>
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
    setContrast(state: State, action: PayloadAction<{ contrast: number }>) {
      state.contrast = action.payload.contrast;
    },
    setExposure(state: State, action: PayloadAction<{ exposure: number }>) {
      state.exposure = action.payload.exposure;
    },
    setHue(state: State, action: PayloadAction<{ hue: number }>) {
      state.hue = action.payload.hue;
    },
    setImage(state: State, action: PayloadAction<{ image: Image }>) {
      state.image = action.payload.image;
    },
    setImageInstances(
      state: State,
      action: PayloadAction<{ instances: Array<Selection> }>
    ) {
      if (!state.image) return;
      state.image.instances = action.payload.instances;
    },
    setImageName(state: State, action: PayloadAction<{ name: string }>) {
      if (!state.image) return;

      state.image.name = action.payload.name;
    },
    setInvertMode(
      state: State,
      action: PayloadAction<{ invertMode: boolean }>
    ) {
      state.invertMode = action.payload.invertMode;
    },
    setLanguage(state: State, action: PayloadAction<{ language: Language }>) {
      state.language = action.payload.language;
    },
    setOperation(state: State, action: PayloadAction<{ operation: ToolType }>) {
      state.toolType = action.payload.operation;
    },
    setPenSelectionBrushSize(
      state: State,
      action: PayloadAction<{ penSelectionBrushSize: number }>
    ) {
      state.penSelectionBrushSize = action.payload.penSelectionBrushSize;
    },
    setSaturation(state: State, action: PayloadAction<{ saturation: number }>) {
      state.saturation = action.payload.saturation;
    },
    setSeletedCategory(
      state: State,
      action: PayloadAction<{ selectedCategory: string }>
    ) {
      state.selectedCategory = action.payload.selectedCategory;
    },
    setSelectedAnnotation(
      state: State,
      action: PayloadAction<{ selectedAnnotation: string | undefined }>
    ) {
      state.selectedAnnotation = action.payload.selectedAnnotation;
    },
    setSelectionMode(
      state: State,
      action: PayloadAction<{ selectionMode: SelectionMode }>
    ) {
      state.selectionMode = action.payload.selectionMode;
    },
    setSoundEnabled(
      state: State,
      action: PayloadAction<{ soundEnabled: boolean }>
    ) {
      state.soundEnabled = action.payload.soundEnabled;
    },
    setVibrance(state: State, action: PayloadAction<{ vibrance: number }>) {
      state.vibrance = action.payload.vibrance;
    },
    setZoomAutomaticCentering(
      state: State,
      action: PayloadAction<{ zoomAutomaticCentering: boolean }>
    ) {
      state.zoomSettings.zoomAutomaticCentering =
        action.payload.zoomAutomaticCentering;
    },
    setZoomMode(state: State, action: PayloadAction<{ zoomMode: ZoomMode }>) {
      state.zoomSettings.zoomMode = action.payload.zoomMode;
    },
    setZoomReset(state: State, action: PayloadAction<{ zoomReset: boolean }>) {
      state.zoomSettings.zoomReset = action.payload.zoomReset;
    },
  },
  extraReducers: {
    ["thunks/loadLayersModel/fulfilled"]: (
      state: State,
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
  setZoomMode,
  setZoomReset,
} = slice.actions;
