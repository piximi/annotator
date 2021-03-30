import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToolOptionsStateType } from "../../types/ToolOptionsStateType";
import { ZoomMode } from "../../types/ZoomMode";
import { ZoomToolOptionsType } from "../../types/ZoomToolOptionsType";

const initialState: ToolOptionsStateType = {
  zoom: {
    zoomAutomaticCentering: false,
    zoomMode: ZoomMode.In,
    zoomReset: false,
  },
};

export const toolOptionsSlice = createSlice({
  initialState: initialState,
  name: "image-viewer-tool-options",
  reducers: {
    setZoomOptions(
      state: ToolOptionsStateType,
      action: PayloadAction<{ options: ZoomToolOptionsType }>
    ) {
      state.zoom = action.payload.options;
    },
  },
});

export const { setZoomOptions } = toolOptionsSlice.actions;
