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

export const imageViewerSlice = createSlice({
  initialState: initialState,
  name: "image-viewer",
  reducers: {
    deleteImageViewerImageInstance(
      state: ImageViewerState,
      action: PayloadAction<{ id: string }>
    ) {
      if (!state.image) return;

      state.image.instances = state.image.instances.filter(
        (instance: ImageViewerSelection) => instance.id !== action.payload.id
      );
    },
    setImageViewerBrightness(
      state: ImageViewerState,
      action: PayloadAction<{ brightness: number }>
    ) {
      state.brightness = action.payload.brightness;
    },
    setImageViewerCategories(
      state: ImageViewerState,
      action: PayloadAction<{ categories: Array<Category> }>
    ) {
      state.categories = action.payload.categories;
    },
    setImageViewerContrast(
      state: ImageViewerState,
      action: PayloadAction<{ contrast: number }>
    ) {
      state.contrast = action.payload.contrast;
    },
    setImageViewerExposure(
      state: ImageViewerState,
      action: PayloadAction<{ exposure: number }>
    ) {
      state.exposure = action.payload.exposure;
    },
    setImageViewerHue(
      state: ImageViewerState,
      action: PayloadAction<{ hue: number }>
    ) {
      state.hue = action.payload.hue;
    },
    setImageViewerImage(
      state: ImageViewerState,
      action: PayloadAction<{ image: Image }>
    ) {
      state.image = action.payload.image;
    },
    setImageViewerImageInstances(
      state: ImageViewerState,
      action: PayloadAction<{ instances: Array<ImageViewerSelection> }>
    ) {
      if (state.image) {
        state.image.instances = action.payload.instances;
      }
    },
    setImageViewerOperation(
      state: ImageViewerState,
      action: PayloadAction<{ operation: ImageViewerOperation }>
    ) {
      state.operation = action.payload.operation;
    },
    setImageViewerSaturation(
      state: ImageViewerState,
      action: PayloadAction<{ saturation: number }>
    ) {
      state.saturation = action.payload.saturation;
    },
    setImageViewerSeletedCategoryId(
      state: ImageViewerState,
      action: PayloadAction<{ selectedCategoryId: string }>
    ) {
      state.selectedCategoryId = action.payload.selectedCategoryId;
    },
    setImageViewerSelectionMode(
      state: ImageViewerState,
      action: PayloadAction<{ selectionMode: ImageViewerSelectionMode }>
    ) {
      state.selectionMode = action.payload.selectionMode;
    },
    setImageViewerVibrance(
      state: ImageViewerState,
      action: PayloadAction<{ vibrance: number }>
    ) {
      state.vibrance = action.payload.vibrance;
    },
    setImageViewerZoomMode(
      state: ImageViewerState,
      action: PayloadAction<{ zoomMode: ImageViewerZoomMode }>
    ) {
      state.zoomMode = action.payload.zoomMode;
    },
  },
});

export const {
  deleteImageViewerImageInstance,
  setImageViewerBrightness,
  setImageViewerCategories,
  setImageViewerContrast,
  setImageViewerExposure,
  setImageViewerHue,
  setImageViewerImage,
  setImageViewerImageInstances,
  setImageViewerOperation,
  setImageViewerSaturation,
  setImageViewerSelectionMode,
  setImageViewerSeletedCategoryId,
  setImageViewerVibrance,
  setImageViewerZoomMode,
} = imageViewerSlice.actions;
