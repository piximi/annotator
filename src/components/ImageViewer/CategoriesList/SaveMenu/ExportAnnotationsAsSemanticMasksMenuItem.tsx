import React from "react";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  imageInstancesSelector,
} from "../../../../store/selectors";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  saveAnnotationsAsLabelMatrix,
  saveAnnotationsAsSemanticSegmentationMasks,
} from "../../../../image/imageHelper";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const ExportAnnotationsAsSemanticMasksMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(imageInstancesSelector);
  const images = useSelector(imagesSelector);
  const categories = useSelector(categoriesSelector);

  const onExport = () => {
    popupState.close();

    if (!annotations) return;

    let zip = new JSZip();

    saveAnnotationsAsSemanticSegmentationMasks(images, categories, zip);
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Semantic segmentation masks" />
    </MenuItem>
  );
};
