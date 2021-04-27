import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@material-ui/core";
import image from "../../../../images/contemplative-reptile.jpeg";
import { useStyles } from "./Tool.css";

type TooltipCardProps = {
  name: string;
};

type ToolProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
  selected: boolean;
};

const TooltipCard = ({ name }: TooltipCardProps) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia className={classes.cardMedia} image={image} />

        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const Tool = ({ children, name, onClick, selected }: ToolProps) => {
  const classes = useStyles();

  return (
    <Tooltip className={classes.tooltip} title={<TooltipCard name={name} />}>
      <ListItem button onClick={onClick} selected={selected}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};
