import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React, { useState } from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
} from "@material-ui/core";
import { useStyles } from "./Tool.css";
import CancelIcon from "@material-ui/icons/Cancel";
import { Tooltip } from "@material-ui/core";

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
      description = "Select annotations (S)";
      break;
    case "Rectangular annotation":
      description = "Rectangular annotation (R)";
      break;
    case "Elliptical annotation":
      description = "Elliptical annotation (E)";
      break;
    case "Freehand annotation":
      description = "Pen annotation (D)";
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
      description = "Hand tool (H)";
      break;
    case "Zoom":
      description = "Zoom tool (Z)";
      break;
    case "Color Adjustment":
      description = "Intensity adjustment (I)";
      break;
    default:
      description = "";
  }

  return (
    <Card className={classes.card} raised variant="outlined">
      <CardActionArea>
        <div>
          {/*<CardHeader*/}
          {/*  action={*/}
          {/*    <IconButton onClick={onClose}>*/}
          {/*      <CancelIcon />*/}
          {/*    </IconButton>*/}
          {/*  }*/}
          {/*  className={classes.cardHeader}*/}
          {/*/>*/}

          {/*<CardMedia className={classes.cardMedia} image={image} />*/}
        </div>

        <CardContent>
          {/*<Typography gutterBottom variant="h6" component="h2">*/}
          {/*  {name}*/}
          {/*</Typography>*/}

          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/*<CardActions>*/}
      {/*  <Button size="small" color="primary">*/}
      {/*    Learn More*/}
      {/*  </Button>*/}
      {/*</CardActions>*/}
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
      // title={"test"}
    >
      <ListItem button onClick={onClick} selected={selected}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </Tooltip>
    // <ListItem button onClick={onClick} selected={selected}>
    //   <ListItemIcon>
    //     <SvgIcon fontSize="small">{children}</SvgIcon>
    //   </ListItemIcon>
    // </ListItem>
  );
};
