import { StateType } from "../../types/StateType";

export const imageSrcSelector = ({ state }: { state: StateType }) => {
  const image = state.present.image;

  if (!image) return;

  return image.src;
};
