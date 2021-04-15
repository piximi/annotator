import { HistoryStateType } from "../../types/HistoryStateType";

export const zoomSelectionSelector = ({
  state,
}: {
  state: HistoryStateType;
}): {
  dragging: boolean;
  minimum: { x: number; y: number } | undefined;
  maximum: { x: number; y: number } | undefined;
  selecting: boolean;
} => {
  return state.present.zoomSelection;
};
