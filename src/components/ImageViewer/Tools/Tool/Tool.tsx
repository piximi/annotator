import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardActionArea,
  CardActions,
  Button,
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
    <Card className={classes.card} raised variant="outlined">
      <CardActionArea>
        <CardMedia className={classes.cardMedia} image={image} />

        <CardContent>
          <Typography gutterBottom variant="h6" component="h2">
            {name}
          </Typography>

          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
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

  return (
    <Tooltip
      classes={{ tooltip: classes.tooltip }}
      placement="left"
      title={<TooltipCard name={name} />}
    >
      <ListItem button onClick={onClick} selected={selected}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};
