import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageViewerState } from "../../types/ImageViewerState";
import { Image } from "../../types/Image";
import { ImageViewerSelectionMode } from "../../types/ImageViewerSelectionMode";
import { ImageViewerOperation } from "../../types/ImageViewerOperation";
import { ImageViewerZoomMode } from "../../types/ImageViewerZoomMode";
import { ImageViewerSelection } from "../../types/ImageViewerSelection";
import { Category } from "../../types/Category";

const initialState: ImageViewerState = {
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
  operation: ImageViewerOperation.RectangularSelection,
  saturation: 0,
  selectedCategoryId: "00000000-0000-0000-0000-000000000000",
  selectionMode: ImageViewerSelectionMode.New,
  vibrance: 0,
  zoomMode: ImageViewerZoomMode.In,
};

export const slice = createSlice({
  initialState: initialState,
  name: "image-viewer",
  reducers: {
    deleteImageInstance(
      state: ImageViewerState,
      action: PayloadAction<{ id: string }>
    ) {
      if (!state.image) return;

      state.image.instances = state.image.instances.filter(
        (instance: ImageViewerSelection) => instance.id !== action.payload.id
      );
    },
    setBrightness(
      state: ImageViewerState,
      action: PayloadAction<{ brightness: number }>
    ) {
      state.brightness = action.payload.brightness;
    },
    setCategories(
      state: ImageViewerState,
      action: PayloadAction<{ categories: Array<Category> }>
    ) {
      state.categories = action.payload.categories;
    },
    setContrast(
      state: ImageViewerState,
      action: PayloadAction<{ contrast: number }>
    ) {
      state.contrast = action.payload.contrast;
    },
    setExposure(
      state: ImageViewerState,
      action: PayloadAction<{ exposure: number }>
    ) {
      state.exposure = action.payload.exposure;
    },
    setHue(state: ImageViewerState, action: PayloadAction<{ hue: number }>) {
      state.hue = action.payload.hue;
    },
    setImage(state: ImageViewerState, action: PayloadAction<{ image: Image }>) {
      state.image = action.payload.image;
    },
    setImageInstances(
      state: ImageViewerState,
      action: PayloadAction<{ instances: Array<ImageViewerSelection> }>
    ) {
      if (state.image) {
        state.image.instances = action.payload.instances;
      }
    },
    setOperation(
      state: ImageViewerState,
      action: PayloadAction<{ operation: ImageViewerOperation }>
    ) {
      state.operation = action.payload.operation;
    },
    setSaturation(
      state: ImageViewerState,
      action: PayloadAction<{ saturation: number }>
    ) {
      state.saturation = action.payload.saturation;
    },
    setSeletedCategoryId(
      state: ImageViewerState,
      action: PayloadAction<{ selectedCategoryId: string }>
    ) {
      state.selectedCategoryId = action.payload.selectedCategoryId;
    },
    setSelectionMode(
      state: ImageViewerState,
      action: PayloadAction<{ selectionMode: ImageViewerSelectionMode }>
    ) {
      state.selectionMode = action.payload.selectionMode;
    },
    setVibrance(
      state: ImageViewerState,
      action: PayloadAction<{ vibrance: number }>
    ) {
      state.vibrance = action.payload.vibrance;
    },
    setZoomMode(
      state: ImageViewerState,
      action: PayloadAction<{ zoomMode: ImageViewerZoomMode }>
    ) {
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
