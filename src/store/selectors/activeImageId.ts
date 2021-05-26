import { HistoryStateType } from "../../types/HistoryStateType";
import { ImageType } from "../../types/ImageType";

export const activeImageId = ({
  state,
}: {
  state: HistoryStateType;
}): string | undefined => {
  return state.present.activeImageId;
};
