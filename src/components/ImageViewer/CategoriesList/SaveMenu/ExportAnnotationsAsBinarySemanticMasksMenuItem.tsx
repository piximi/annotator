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
import {
  saveAnnotationsAsLabeledSemanticSegmentationMasks,
  saveAnnotationsAsLabelMatrix,
} from "../../../../image/imageHelper";
import { saveAs } from "file-saver";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const ExportAnnotationsAsBinarySemanticMasksMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(imageInstancesSelector);
  const images = useSelector(imagesSelector);
  const categories = useSelector(categoriesSelector);

  const onExport = () => {
    popupState.close();

    if (!annotations) return;

    let zip = new JSZip();
    Promise.all(
      saveAnnotationsAsLabelMatrix(images, categories, zip, false, true)
    ).then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "binary_semantics.zip");
      });
    });
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Binary semantic masks" />
    </MenuItem>
  );
};
