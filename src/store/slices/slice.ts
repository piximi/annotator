import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/Category";
import { Image } from "../../types/Image";
import { Tool } from "../../types/Tool";
import { Selection } from "../../types/Selection";
import { SelectionMode } from "../../types/SelectionMode";
import { State } from "../../types/State";
import { ZoomMode } from "../../types/ZoomMode";
import * as _ from "lodash";
import colorImage from "../../images/colorImage.png";

const initialState: State = {
  brightness: 0,
  categories: [
    {
      color: "#AAAAAA",
      id: "00000000-0000-0000-0000-000000000000",
      name: "Unknown",
      visible: true,
    },
  ],
  contrast: 0,
  exposure: 0,
  hue: 0,
  image: {
    id: "",
    instances: [],
    name: "foo.png",
    shape: { c: 512, channels: 3, r: 512 },
    src: colorImage,
  },
  invertMode: false,
  operation: Tool.RectangularSelection,
  penSelectionBrushSize: 1,
  saturation: 0,
  selectedCategory: "00000000-0000-0000-0000-000000000000",
  selectionMode: SelectionMode.New,
  vibrance: 0,
  zoomSettings: {
    center: true,
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
    setInvertMode(
      state: State,
      action: PayloadAction<{ invertMode: boolean }>
    ) {
      state.invertMode = action.payload.invertMode;
    },
    setOperation(state: State, action: PayloadAction<{ operation: Tool }>) {
      state.operation = action.payload.operation;
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
    setSelectionMode(
      state: State,
      action: PayloadAction<{ selectionMode: SelectionMode }>
    ) {
      state.selectionMode = action.payload.selectionMode;
    },
    setVibrance(state: State, action: PayloadAction<{ vibrance: number }>) {
      state.vibrance = action.payload.vibrance;
    },
    setZoomMode(state: State, action: PayloadAction<{ zoomMode: ZoomMode }>) {
      state.zoomSettings.zoomMode = action.payload.zoomMode;
    },
    setZoomReset(state: State, action: PayloadAction<{ zoomReset: boolean }>) {
      state.zoomSettings.zoomReset = action.payload.zoomReset;
    },
  },
});

export const {
  deleteCategory,
  deleteImageInstance,
  setBrightness,
  setCategories,
  setCategoryVisibility,
  setContrast,
  setExposure,
  setHue,
  setImage,
  setImageInstances,
  setInvertMode,
  setOperation,
  setPenSelectionBrushSize,
  setSaturation,
  setSelectionMode,
  setSeletedCategory,
  setVibrance,
  setZoomMode,
  setZoomReset,
} = slice.actions;
