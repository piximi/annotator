import { HistoryStateType } from "../../types/HistoryStateType";

export const pointerSelectionSelector = ({
  state,
}: {
  state: HistoryStateType;
}): {
  minimum: { x: number; y: number } | undefined;
  maximum: { x: number; y: number } | undefined;
  selecting: boolean;
} => {
  return state.present.pointerSelection;
};
