import { State } from "../../types/ImageViewerState";
import { ZoomMode } from "../../types/ImageViewerZoomMode";

export const zoomModeSelector = ({ state }: { state: State }): ZoomMode => {
  return state.zoomMode;
};
