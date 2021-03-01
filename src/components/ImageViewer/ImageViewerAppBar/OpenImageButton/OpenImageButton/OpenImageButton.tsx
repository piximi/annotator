import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Menu from "@material-ui/core/Menu";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useStyles } from "./OpenImageButton.css";
import { ComputerMenuItem } from "../ComputerMenuItem";
import { ExampleMenuItem } from "../ExampleMenuItem";

type OpenImageMenuProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
};

type ComputerMenuItemProps = {
  onClose: () => void;
};

type ExampleMenuItemProps = {
  onClose: () => void;
};

const ComputerMenuItemRef = React.forwardRef<any, ComputerMenuItemProps>(
  ({ onClose }, ref) => <ComputerMenuItem onClose={onClose} />
);

const ExampleMenuItemRef = React.forwardRef<any, ExampleMenuItemProps>(
  ({ onClose }, ref) => <ExampleMenuItem onClose={onClose} />
);

const OpenImageMenu = ({ anchorEl, onClose }: OpenImageMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      onClose={onClose}
      open={Boolean(anchorEl)}
    >
      <ComputerMenuItemRef onClose={onClose} />

      <ExampleMenuItemRef onClose={onClose} />
    </Menu>
  );
};

export const OpenImageButton = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const classes = useStyles();

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Tooltip title="Open image">
        <Button
          className={classes.button}
          startIcon={<CloudUploadIcon />}
          onClick={onClick}
        >
          Open image
        </Button>
      </Tooltip>

      <OpenImageMenu anchorEl={anchorEl} onClose={onClose} />
    </React.Fragment>
  );
};
