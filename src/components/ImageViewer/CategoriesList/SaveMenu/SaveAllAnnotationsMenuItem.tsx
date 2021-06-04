import { useSelector } from "react-redux";
import { allSerializedAnnotationsSelector } from "../../../../store/selectors/allSerializedAnnotationsSelector";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const SaveAllAnnotationsMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const allAnnotations = useSelector(allSerializedAnnotationsSelector);

  const onSaveAllAnnotations = () => {
    popupState.close();

    let zip = new JSZip();

    let blob: Blob;

    allAnnotations.forEach((serializedAnnotations) => {
      if (!serializedAnnotations) return;
      blob = new Blob([JSON.stringify(serializedAnnotations)], {
        type: "application/json;charset=utf-8",
      });
      zip.folder("annotations");
      zip.file(`annotations/${serializedAnnotations.imageFilename}.json`, blob);
    });

    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "annotations.zip");
    });
  };
  return (
    <MenuItem onClick={onSaveAllAnnotations}>
      <ListItemText primary="Save all annotations" />
    </MenuItem>
  );
};
