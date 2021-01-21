import { Settings } from "../../types/Settings";
import { ImageViewerOperation } from "../../types/ImageViewerOperation";

export const selectionMethodSelector = ({
  settings,
}: {
  settings: Settings;
}): ImageViewerOperation => {
  return settings.selectionMethod;
};
