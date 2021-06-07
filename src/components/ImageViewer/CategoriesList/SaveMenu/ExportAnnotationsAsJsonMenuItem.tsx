import { useSelector } from "react-redux";
import { activeSerializedAnnotationsSelector } from "../../../../store/selectors/activeSerializedAnnotationsSelector";
import { saveAs } from "file-saver";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const ExportAnnotationsAsJsonMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(activeSerializedAnnotationsSelector);
  const images = useSelector(imagesSelector);

  const onSaveAnnotations = () => {
    popupState.close();
    if (!annotations) return;
    const blob = new Blob([JSON.stringify(annotations)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, `${annotations.imageFilename}.json`);
  };

  return (
    <MenuItem onClick={onSaveAnnotations}>
      <ListItemText primary="Export annotations as json" />
    </MenuItem>
  );
};
