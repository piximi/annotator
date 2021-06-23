import { useSelector } from "react-redux";
import { allSerializedAnnotationsSelector } from "../../../../store/selectors/allSerializedAnnotationsSelector";
import { saveAs } from "file-saver";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
  handleCloseMenu: () => void;
};

export const SaveProjectFileMenuItem = ({
  popupState,
  handleCloseMenu,
}: SaveAnnotationsMenuItemProps) => {
  const serializedProject = useSelector(allSerializedAnnotationsSelector);

  const onSaveAllAnnotations = () => {
    const blob = new Blob([JSON.stringify(serializedProject)]);

    saveAs(blob, "project.json");

    popupState.close();
    handleCloseMenu();
  };
  return (
    <MenuItem onClick={onSaveAllAnnotations}>
      <ListItemText primary="Save project file" />
    </MenuItem>
  );
};
