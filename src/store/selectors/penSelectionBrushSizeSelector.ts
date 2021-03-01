import { State } from "../../types/State";

export const penSelectionBrushSizeSelector = ({ state }: { state: State }) => {
  return state.penSelectionBrushSize;
};
