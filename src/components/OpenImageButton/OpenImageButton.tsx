import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import {Shape} from "../../types/Shape";
import {setImageViewerImage} from "../../store/slices";
import {useDispatch} from "react-redux";
import {useStyles} from "./OpenImageButton.css";

type ComputerMenuItemProps = {
  onClose: () => void;
}

const ComputerMenuItem = ({onClose}: ComputerMenuItemProps) => {
  const dispatch = useDispatch();

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onClose();

    event.persist();

    if (event.currentTarget.files) {
      const blob = event.currentTarget.files[0];

      const reader = new FileReader();

      reader.onload = async (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          const src = event.target.result;

          const image = new Image();

          image.onload = () => {
            const name = blob.name;

            const shape: Shape = {
              r: image.naturalHeight,
              c: image.naturalWidth,
              channels: 4,
            };

            dispatch(
              setImageViewerImage({
                image: {
                  id: "",
                  instances: [],
                  name: name,
                  shape: shape,
                  src: src as string,
                },
              })
            );
          };

          image.src = src as string;
        }
      };

      reader.readAsDataURL(blob);
    }
  };


  return (
    <MenuItem component="label">
      Computer
      <input
        accept="image/*"
        hidden
        id="open-image"
        onChange={onChange}
        type="file"
      />
    </MenuItem>
  );
}

type ExampleMenuItemProps = {
  onClose: () => void;
}

const ExampleMenuItem = ({onClose}: ExampleMenuItemProps) => {
  const onClick = () => {
    onClose();
  }

  return (
    <MenuItem onClick={onClick}>Example</MenuItem>
  );
}

type OpenImageMenuProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
}

const OpenImageMenu = ({anchorEl, onClose}: OpenImageMenuProps) => {
  return (
    <Menu anchorEl={anchorEl} keepMounted onClose={onClose} open={Boolean(anchorEl)}>
      <ComputerMenuItem onClose={onClose}/>

      <ExampleMenuItem onClose={onClose}/>
    </Menu>
  )
}

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
        <Button className={classes.button} startIcon={<CloudUploadIcon />} onClick={onClick}>
          Open image
        </Button>
      </Tooltip>

      <OpenImageMenu anchorEl={anchorEl} onClose={onClose}/>
    </React.Fragment>
  );
};
