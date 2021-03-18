import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertSelection.svg";
import RadioGroup from "@material-ui/core/RadioGroup";
import { useDispatch, useSelector } from "react-redux";
import {
  invertModeSelector,
  selectionModeSelector,
} from "../../../../store/selectors";
import { slice } from "../../../../store";
import { SelectionMode } from "../../../../types/SelectionMode";
import { Typography } from "@material-ui/core";
import { SampleList } from "../SampleList";
import ListSubheader from "@material-ui/core/ListSubheader";

export const SelectionOptions = () => {
  const dispatch = useDispatch();

  const selectionMode = useSelector(selectionModeSelector);

  const invertMode = useSelector(invertModeSelector);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      selectionMode: parseInt((event.target as HTMLInputElement).value),
    };

    dispatch(slice.actions.setSelectionMode(payload));
  };

  const onInvertClick = () => {
    dispatch(slice.actions.setInvertMode({ invertMode: !invertMode }));
  };

  return (
    <React.Fragment>
      <RadioGroup
        aria-label="selection mode"
        name="selection-mode"
        onChange={onChange}
        value={selectionMode}
      >
        <List dense>
          <ListItem>
            <ListItemText>
              <Typography variant="inherit">
                Press the Enter key to confirm an annotation.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="inherit">
                Right-click to select an existing annotation.
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="inherit">
                Press the Backspace or Escape key to remove a selected
                annotation.
              </Typography>
            </ListItemText>
          </ListItem>
        </List>

        <Divider />

        <List
          component="nav"
          subheader={<ListSubheader component="div">Mode</ListSubheader>}
        >
          <ListItem dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.New}
              />
            </ListItemIcon>

            <ListItemText primary="New" secondary="Create a new annotation." />
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Add}
              />
            </ListItemIcon>

            <ListItemText
              primary="Add"
              secondary="Add area to the selected annotation."
            />
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Subtract}
              />
            </ListItemIcon>

            <ListItemText
              primary="Subtract"
              secondary="Subtract area from the selected annotation."
            />
          </ListItem>

          <ListItem dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.Intersect}
              />
            </ListItemIcon>

            <ListItemText
              primary="Intersect"
              secondary="Constrain the boundary of the new annotion to the selected annotation."
            />
          </ListItem>
        </List>
      </RadioGroup>

      <Divider />

      <List>
        <ListItem button onClick={onInvertClick} dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary="Invert annotation" />
        </ListItem>
      </List>

      <Divider />

      <SampleList />
    </React.Fragment>
  );
};
