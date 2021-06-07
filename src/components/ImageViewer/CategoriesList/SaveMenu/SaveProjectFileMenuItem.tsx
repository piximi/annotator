import { useSelector } from "react-redux";
import { allSerializedAnnotationsSelector } from "../../../../store/selectors/allSerializedAnnotationsSelector";
import { saveAs } from "file-saver";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const SaveProjectFileMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const allAnnotations = useSelector(allSerializedAnnotationsSelector);

  const onSaveAllAnnotations = () => {
    popupState.close();

    const blob = new Blob([JSON.stringify(allAnnotations)]);

    saveAs(blob, "project.json");
  };
  return (
    <MenuItem onClick={onSaveAllAnnotations}>
      <ListItemText primary="Save project file" />
    </MenuItem>
  );
};
