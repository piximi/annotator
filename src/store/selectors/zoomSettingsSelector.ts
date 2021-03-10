import { State } from "../../types/State";
import { ZoomSettings } from "../../types/ZoomSettings";

export const zoomSettingsSelector = ({
  state,
}: {
  state: State;
}): ZoomSettings => {
  return state.zoomSettings;
};
