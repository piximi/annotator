import { State } from "../../types/State";
import { ZoomMode } from "../../types/ZoomMode";

export const zoomModeSelector = ({ state }: { state: State }): ZoomMode => {
  return state.zoomMode;
};
