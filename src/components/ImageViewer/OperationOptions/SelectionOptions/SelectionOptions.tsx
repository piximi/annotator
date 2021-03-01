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
import { selectionModeSelector } from "../../../../store/selectors";
import { slice } from "../../../../store/slices";
import { SelectionMode } from "../../../../types/SelectionMode";

export const SelectionOptions = () => {
  const dispatch = useDispatch();

  const selectionMode = useSelector(selectionModeSelector);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      selectionMode: parseInt((event.target as HTMLInputElement).value),
    };

    dispatch(slice.actions.setSelectionMode(payload));
  };

  return (
    <React.Fragment>
      <RadioGroup
        aria-label="selection mode"
        name="selection-mode"
        onChange={onChange}
        value={selectionMode}
      >
        <List>
          <ListItem dense>
            <ListItemIcon>
              <Radio
                disableRipple
                edge="start"
                tabIndex={-1}
                value={SelectionMode.New}
              />
            </ListItemIcon>

            <ListItemText primary="New" secondary="Create a new selection." />
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
              secondary="Add area to the existing selection."
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
              secondary="Subtract area from the existing selection."
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
              secondary="Constrain the boundary of the new selection to the existing selection."
            />
          </ListItem>
        </List>
      </RadioGroup>

      <Divider />

      <List>
        <ListItem button dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary="Invert selection" />
        </ListItem>
      </List>
    </React.Fragment>
  );
};
