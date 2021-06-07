import React from "react";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  imageInstancesSelector,
} from "../../../../store/selectors";
import { decode } from "../../../../image/rle";
import * as ImageJS from "image-js";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { ImageType } from "../../../../types/ImageType";
import { AnnotationType } from "../../../../types/AnnotationType";
import JSZip from "jszip";
import { CategoryType } from "../../../../types/CategoryType";
import { saveAs } from "file-saver";
import { saveAnnotationsAsMasks } from "../../../../image/imageHelper";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const ExportAnnotationsAsImagesMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(imageInstancesSelector);
  const images = useSelector(imagesSelector);
  const categories = useSelector(categoriesSelector);

  const onExport = () => {
    popupState.close();

    if (!annotations) return;

    let zip = new JSZip();

    Promise.all(saveAnnotationsAsMasks(images, categories, zip)).then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "annotations.zip");
      });
    });
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Export annotations" />
    </MenuItem>
  );
};
