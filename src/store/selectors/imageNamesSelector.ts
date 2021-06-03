import { HistoryStateType } from "../../types/HistoryStateType";
import { ImageType } from "../../types/ImageType";

export const imageNamesSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<string> => {
  if (!state.present.images.length) return [];

  return state.present.images.map((image: ImageType) => {
    return image.name.split(".")[0];
  });
};
