import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { State } from "../../types/ImageViewerState";
import { Image } from "../../types/Image";
import { SelectionMode } from "../../types/ImageViewerSelectionMode";
import { Operation } from "../../types/ImageViewerOperation";
import { ZoomMode } from "../../types/ImageViewerZoomMode";
import { Selection } from "../../types/ImageViewerSelection";
import { Category } from "../../types/Category";

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
  operation: Operation.RectangularSelection,
  saturation: 0,
  selectedCategoryId: "00000000-0000-0000-0000-000000000000",
  selectionMode: SelectionMode.New,
  vibrance: 0,
  zoomMode: ZoomMode.In,
};

export const slice = createSlice({
  initialState: initialState,
  name: "image-viewer",
  reducers: {
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
      if (state.image) {
        state.image.instances = action.payload.instances;
      }
    },
    setOperation(
      state: State,
      action: PayloadAction<{ operation: Operation }>
    ) {
      state.operation = action.payload.operation;
    },
    setSaturation(state: State, action: PayloadAction<{ saturation: number }>) {
      state.saturation = action.payload.saturation;
    },
    setSeletedCategoryId(
      state: State,
      action: PayloadAction<{ selectedCategoryId: string }>
    ) {
      state.selectedCategoryId = action.payload.selectedCategoryId;
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
      state.zoomMode = action.payload.zoomMode;
    },
  },
});

export const {
  deleteImageInstance,
  setBrightness,
  setCategories,
  setContrast,
  setExposure,
  setHue,
  setImage,
  setImageInstances,
  setOperation,
  setSaturation,
  setSelectionMode,
  setSeletedCategoryId,
  setVibrance,
  setZoomMode,
} = slice.actions;
