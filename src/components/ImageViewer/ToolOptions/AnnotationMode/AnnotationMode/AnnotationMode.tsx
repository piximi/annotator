import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import { useDispatch, useSelector } from "react-redux";
import { selectionModeSelector } from "../../../../../store/selectors";
import { slice } from "../../../../../store";
import { SelectionMode } from "../../../../../types/SelectionMode";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "@material-ui/core/Tooltip";

export const AnnotationMode = () => {
  const dispatch = useDispatch();

  const annotationMode = useSelector(selectionModeSelector);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      selectionMode: parseInt((event.target as HTMLInputElement).value),
    };

    dispatch(slice.actions.setSelectionMode(payload));
  };

  return (
    <RadioGroup
      aria-label="annotation mode"
      name="annotation-mode"
      onChange={onChange}
      value={annotationMode}
    >
      <List
        component="nav"
        subheader={
          <ListSubheader component="div">Annotation mode</ListSubheader>
        }
      >
        <Tooltip title="Create a new annotation." placement="bottom">
          <ListItem button dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.New}
              />
            </ListItemIcon>

            <ListItemText primary="New annotation" />
          </ListItem>
        </Tooltip>

        <Tooltip
          title="Add area to the selected annotation."
          placement="bottom"
        >
          <ListItem button dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Add}
              />
            </ListItemIcon>

            <ListItemText primary="Add area" />
          </ListItem>
        </Tooltip>

        <Tooltip
          title="Subtract area from the selected annotation."
          placement="bottom"
        >
          <ListItem button dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Subtract}
              />
            </ListItemIcon>

            <ListItemText primary="Subtract area" />
          </ListItem>
        </Tooltip>

        <Tooltip
          title="Constrain the boundary of the new annotion to the selected annotation."
          placement="bottom"
        >
          <ListItem button dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Intersect}
              />
            </ListItemIcon>

            <ListItemText primary="Intersection" />
          </ListItem>
        </Tooltip>
      </List>
    </RadioGroup>
  );
};
