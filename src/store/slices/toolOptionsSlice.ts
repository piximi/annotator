import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToolOptionsStateType } from "../../types/ToolOptionsStateType";
import { ZoomModeType } from "../../types/ZoomModeType";
import { ZoomToolOptionsType } from "../../types/ZoomToolOptionsType";

const initialState: ToolOptionsStateType = {
  zoom: {
    automaticCentering: true,
    mode: ZoomModeType.In,
    toActualSize: false,
    toFit: false,
  },
};

export const toolOptionsSlice = createSlice({
  initialState: initialState,
  name: "image-viewer-tool-options",
  reducers: {
    setZoomToolOptions(
      state: ToolOptionsStateType,
      action: PayloadAction<{ options: ZoomToolOptionsType }>
    ) {
      state.zoom = action.payload.options;
    },
  },
});

export const { setZoomToolOptions } = toolOptionsSlice.actions;
