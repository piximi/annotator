import { Menu } from "@material-ui/core";
import { bindMenu } from "material-ui-popup-state";
import React from "react";
import { ExportAnnotationsMenuItem } from "./ExportAnnotationsMenuItem";
import { ExportAllAnnotationsMenuItem } from "./ExportAllAnnotationsMenuItem";
import { SaveProjectMenuItem } from "./SaveProjectMenuItem";

type SaveMenuProps = {
  popupState: any;
};

export const SaveMenu = ({ popupState }: SaveMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <ExportAnnotationsMenuItem popupState={popupState} />
      <ExportAllAnnotationsMenuItem popupState={popupState} />
      <SaveProjectMenuItem popupState={popupState} />
    </Menu>
  );
};
