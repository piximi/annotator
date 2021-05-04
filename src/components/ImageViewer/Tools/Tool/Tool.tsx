import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React, { useState } from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardActionArea,
  CardActions,
  Button,
  CardHeader,
  IconButton,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import image from "../../../../images/contemplative-reptile.jpeg";
import { useStyles } from "./Tool.css";
import CancelIcon from "@material-ui/icons/Cancel";

type TooltipCardProps = {
  name: string;
  onClose: () => void;
};

type ToolProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
  selected: boolean;
};

export const TooltipCard = ({ name, onClose }: TooltipCardProps) => {
  const classes = useStyles();

  let description: string;

  switch (name) {
    case "Pointer":
      description =
        "Click or draw a rectangular selection to select annotations. Hold shift to add additional annotations to your selections.";
      break;
    case "Rectangular annotation (M)":
      description =
        "Click to draw a rectangular annotation. Release to close the annotation.";
      break;
    case "Elliptical annotation":
      description =
        "Click to  draw an elliptical annotation. Release to close the annotation.";
      break;
    case "Freehand annotation":
      description =
        "Paint over pixels by clicking and dragging over the desired area. Release to close the annotation.";
      break;
    case "Lasso annotation (L)":
      description =
        "Draw a lasso annotation. Click and release to create new anchor points. Hit enter to automatically close the selection.";
      break;
    case "Polygonal annotation":
      description =
        "Draw a polygonal annotation. Click and release to create new anchor points. Hit enter to automatically close the selection.";
      break;
    case "Magnetic annotation":
      description =
        "Automatically snap onto the edges of an object. Click and release to create new anchor points.";
      break;
    case "Color annotation":
      description =
        "Click and drag to select a region of similar color intensities. Release to close the annotation.";
      break;
    case "Quick annotation":
      description =
        "Click and drag to select a region of superpixels. Release to close the annotation.";
      break;
    case "Object annotation":
      description =
        "Select a rectangular annotation around a desired object to automatically generate its boundaries.";
      break;
    case "Hand":
      description = "Pan image.";
      break;
    case "Zoom":
      description =
        "Zoom in or out of the image by making a rectangular selection or clicking/wheeling in or out of the image.";
      break;
    default:
      description = "";
  }

  return (
    <Card className={classes.card} raised variant="outlined">
      <CardActionArea>
        <div>
          <CardHeader
            action={
              <IconButton onClick={onClose}>
                <CancelIcon />
              </IconButton>
            }
            className={classes.cardHeader}
          />

          <CardMedia className={classes.cardMedia} image={image} />
        </div>

        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {name}
          </Typography>

          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export const Tool = ({ children, name, onClick, selected }: ToolProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };

  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip }}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      placement="left"
      title={<TooltipCard name={name} onClose={onClose} />}
    >
      <ListItem button onClick={onClick} selected={selected}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};
