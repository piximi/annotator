import { useDialog } from "../../../../hooks/useDialog";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { ExampleImageDialog } from "../ExampleImageDialog";
import React from "react";

type OpenExampleImageMenuItemProps = {
  popupState: any;
};

export const OpenExampleImageMenuItem = ({
  popupState,
}: OpenExampleImageMenuItemProps) => {
  const { onClose, onOpen, open } = useDialog();

  return (
    <MenuItem onClick={onOpen}>
      <ListItemText primary="Open example image" />
      <ExampleImageDialog
        onClose={() => {
          onClose();

          popupState.close();
        }}
        open={open}
      />
    </MenuItem>
  );
};
