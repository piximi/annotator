import * as React from "react";

import { useDialog } from "@piximi/hooks";
import { ConnectedOpenExampleClassifierDialog } from "@piximi/open-example-classifier-dialog";
import { ListItemText, MenuItem, Paper } from "@material-ui/core";

type OpenExampleClassifierMenuItemProps = {
  closeMenu: () => void;
};

export const OpenExampleClassifierMenuItem = (
  props: OpenExampleClassifierMenuItemProps
) => {
  const { closeMenu } = props;

  const { openedDialog, openDialog, closeDialog } = useDialog();

  const onClick = () => {
    openDialog();
  };

  return (
    <React.Fragment>
      <MenuItem onClick={onClick}>
        <ListItemText primary="Open example classifier" />
      </MenuItem>

      <ConnectedOpenExampleClassifierDialog
        onClose={closeDialog}
        open={openedDialog}
        closeMenu={closeMenu}
      />
    </React.Fragment>
  );
};
