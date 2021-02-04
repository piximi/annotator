import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Dialog from "@material-ui/core/Dialog";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { Shape } from "../../../../types/Shape";
import { setImageViewerImage } from "../../../../store/slices";
import { useDispatch } from "react-redux";
import { useStyles } from "./OpenImageButton.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import malaria from "../../../../images/malaria.png";

type ExampleImageDialogProps = {
  onClose: () => void;
  open: boolean;
};

const ExampleImageDialog = ({ onClose, open }: ExampleImageDialogProps) => {
  const dispatch = useDispatch();

  const examples = [
    {
      name: "Microscopy",
      description:
        "Fusce lectus lorem, lacinia eu libero eu, pellentesque semper dui. Nunc bibendum est eget lacus fermentum ullamcorper.",
      data: malaria,
    },
    {
      name: "Microscopy (3D)",
      description:
        "Cras lobortis sapien eu tellus malesuada sodales. Vivamus placerat est eu mi ullamcorper, ut ultrices elit rhoncus. Aliquam vitae viverra nisi. Sed odio metus, finibus quis nisi a, vulputate varius justo.",
      data: malaria,
    },
  ];

  const onClick = ({
    data,
    description,
    name,
  }: {
    data: any;
    description: string;
    name: string;
  }) => {
    onClose();

    const shape: Shape = {
      r: 512,
      c: 512,
      channels: 4,
    };

    dispatch(
      setImageViewerImage({
        image: {
          id: "",
          instances: [],
          name: name,
          shape: shape,
          src: data as string,
        },
      })
    );
  };

  return (
    <Dialog open={open}>
      <List component="div" role="list">
        {examples.map((example, index) => {
          return (
            <ListItem
              button
              divider
              role="listitem"
              onClick={() => onClick(example)}
            >
              <ListItemText
                primary={example.name}
                secondary={example.description}
              />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

type ComputerMenuItemProps = {
  onClose: () => void;
};

const ComputerMenuItem = ({ onClose }: ComputerMenuItemProps) => {
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
    <MenuItem component="label" dense>
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
};

type ExampleMenuItemProps = {
  onClose: () => void;
};

const ExampleMenuItem = ({ onClose }: ExampleMenuItemProps) => {
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

type OpenImageMenuProps = {
  anchorEl: null | HTMLElement;
  onClose: () => void;
};

const OpenImageMenu = ({ anchorEl, onClose }: OpenImageMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      onClose={onClose}
      open={Boolean(anchorEl)}
    >
      <ComputerMenuItem onClose={onClose} />

      <ExampleMenuItem onClose={onClose} />
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
