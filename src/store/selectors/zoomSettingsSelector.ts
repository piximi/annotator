import { StateType } from "../../types/StateType";
import { ZoomSettings } from "../../types/ZoomSettings";

export const zoomSettingsSelector = ({
  state,
}: {
  state: StateType;
}): ZoomSettings => {
  return state.zoomSettings;
};
