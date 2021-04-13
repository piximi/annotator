import { HistoryStateType } from "../../types/HistoryStateType";

export const imageInstancesSelector = ({
  state,
}: {
  state: HistoryStateType;
}) => {
  return state.present.image?.annotations;
};
