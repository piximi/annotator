import { Menu } from "@material-ui/core";
import { bindMenu } from "material-ui-popup-state";
import React from "react";
import { SaveProjectFileMenuItem } from "./SaveProjectFileMenuItem";
import { ExportAnnotationsAsImagesMenuItem } from "./ExportAnnotationsAsImagesMenuItem";
import { ExportAnnotationsAsMatrixMenuItem } from "./ExportAnnotationsAsMatrixMenuItem";
import { ExportAnnotationsAsBinaryImageMenuItem } from "./ExportAnnotationsAsBinaryImageMenuItem";
import MenuItem from "@material-ui/core/MenuItem";

type SaveMenuProps = {
  popupState: any;
};

export const SaveMenu = ({ popupState }: SaveMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //TODO: do we need the ExportAnnotationsAsJSON button or is it redundant from SaveProjectFileMenuItem?
  return (
    <Menu {...bindMenu(popupState)}>
      <MenuItem onClick={handleClick}>Save annotations as</MenuItem>
      <Menu
        id="save-annotations-as-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ExportAnnotationsAsImagesMenuItem popupState={popupState} />
        <ExportAnnotationsAsBinaryImageMenuItem popupState={popupState} />
        <ExportAnnotationsAsMatrixMenuItem popupState={popupState} />
      </Menu>
      <SaveProjectFileMenuItem popupState={popupState} />
    </Menu>
  );
};
