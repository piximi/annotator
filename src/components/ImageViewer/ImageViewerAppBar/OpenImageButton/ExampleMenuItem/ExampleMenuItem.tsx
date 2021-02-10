import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import { ExampleImageDialog } from "../ExampleImageDialog";

type ExampleMenuItemProps = {
  onClose: () => void;
};

export const ExampleMenuItem = ({ onClose }: ExampleMenuItemProps) => {
  const [open, setOpen] = React.useState(false);

  const onClick = () => {
    onClose();

    setOpen(true);
  };

  const onDialogClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <MenuItem dense onClick={onClick}>
        Example
      </MenuItem>

      <ExampleImageDialog onClose={onDialogClose} open={open} />
    </React.Fragment>
  );
};
