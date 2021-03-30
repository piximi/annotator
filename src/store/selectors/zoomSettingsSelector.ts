import { StateType } from "../../types/StateType";
import { ZoomToolOptionsType } from "../../types/ZoomToolOptionsType";

export const zoomSettingsSelector = ({
  state,
}: {
  state: StateType;
}): ZoomToolOptionsType => {
  return state.zoomSettings;
};
