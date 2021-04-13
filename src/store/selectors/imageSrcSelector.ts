import { StateType } from "../../types/StateType";

export const imageSrcSelector = ({ state }: { state: StateType }) => {
  const image = state.image;

  if (!image) return;

  return image.src;
};
