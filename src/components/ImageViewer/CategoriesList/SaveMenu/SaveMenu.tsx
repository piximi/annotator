import { Menu } from "@material-ui/core";
import { bindMenu } from "material-ui-popup-state";
import React from "react";
import { SaveAnnotationsMenuItem } from "./SaveAnnotationsMenuItem";
import { SaveAllAnnotationsMenuItem } from "./SaveAllAnnotationsMenuItem";

type SaveMenuProps = {
  popupState: any;
};

export const SaveMenu = ({ popupState }: SaveMenuProps) => {
  return (
    <Menu {...bindMenu(popupState)}>
      <SaveAnnotationsMenuItem popupState={popupState} />
      <SaveAllAnnotationsMenuItem popupState={popupState} />
    </Menu>
  );
};
