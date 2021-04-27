import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

type TipProps = {
  name: string;
};

type ToolProps = {
  children: React.ReactNode;
  name: string;
  onClick: () => void;
  selected: boolean;
};

const Tip = ({ name }: TipProps) => {
  return (
    <React.Fragment>
      <Typography>{name}</Typography>
    </React.Fragment>
  );
};

export const Tool = ({ children, name, onClick, selected }: ToolProps) => {
  return (
    <Tooltip aria-label={name} title={<Tip name={name} />}>
      <ListItem button onClick={onClick} selected={selected}>
        <ListItemIcon>
          <SvgIcon fontSize="small">{children}</SvgIcon>
        </ListItemIcon>
      </ListItem>
    </Tooltip>
  );
};
