import { StateType } from "../../types/StateType";

export const zoomSelectionSelector = ({
  state,
}: {
  state: StateType;
}): {
  dragging: boolean;
  minimum: { x: number; y: number } | undefined;
  maximum: { x: number; y: number } | undefined;
  selecting: boolean;
} => {
  return state.present.zoomSelection;
};
