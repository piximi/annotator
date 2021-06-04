import { Menu } from "@material-ui/core";
import { bindMenu } from "material-ui-popup-state";
import React from "react";
import { ExportAnnotationsAsJsonMenuItem } from "./ExportAnnotationsAsJsonMenuItem";
import { SaveProjectFileMenuItem } from "./SaveProjectFileMenuItem";
import { ExportAnnotationsAsImagesMenuItem } from "./ExportAnnotationsAsImagesMenuItem";

type SaveMenuProps = {
  popupState: any;
};

export const SaveMenu = ({ popupState }: SaveMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <ExportAnnotationsAsJsonMenuItem popupState={popupState} />
      <ExportAnnotationsAsImagesMenuItem popupState={popupState} />
      <SaveProjectFileMenuItem popupState={popupState} />
    </Menu>
  );
};
