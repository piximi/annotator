import { Menu } from "@material-ui/core";
import { bindMenu } from "material-ui-popup-state";
import React from "react";
import { SaveProjectFileMenuItem } from "./SaveProjectFileMenuItem";
import { ExportAnnotationsAsInstanceSegmentationsMenuItem } from "./ExportAnnotationsAsInstanceSegmentationsMenuItem";
import { ExportAnnotationsAsMatrixMenuItem } from "./ExportAnnotationsAsMatrixMenuItem";
import { ExportAnnotationsAsLabeledSemanticMasksMenuItem } from "./ExportAnnotationsAsLabeledSemanticMasksMenuItem";
import MenuItem from "@material-ui/core/MenuItem";
import { ExportAnnotationsAsBinarySemanticMasksMenuItem } from "./ExportAnnotationsAsBinarySemanticMasksMenuItem";

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

  return (
    <Menu {...bindMenu(popupState)}>
      <MenuItem onClick={handleClick}>Export annotations as</MenuItem>
      <Menu
        id="save-annotations-as-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <ExportAnnotationsAsInstanceSegmentationsMenuItem
          popupState={popupState}
        />
        <ExportAnnotationsAsLabeledSemanticMasksMenuItem
          popupState={popupState}
        />
        <ExportAnnotationsAsBinarySemanticMasksMenuItem
          popupState={popupState}
        />
        <ExportAnnotationsAsMatrixMenuItem popupState={popupState} />
      </Menu>
      <SaveProjectFileMenuItem popupState={popupState} />
    </Menu>
  );
};
