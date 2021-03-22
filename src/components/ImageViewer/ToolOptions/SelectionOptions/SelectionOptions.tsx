import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as InvertSelectionIcon } from "../../../icons/InvertAnnotation.svg";
import { useDispatch, useSelector } from "react-redux";
import { invertModeSelector } from "../../../../store/selectors";
import { slice } from "../../../../store";
import { Typography } from "@material-ui/core";
import { SampleList } from "../SampleList";
import { AnnotationMode } from "../AnnotationMode/AnnotationMode";

export const SelectionOptions = () => {
  const dispatch = useDispatch();

  const invertMode = useSelector(invertModeSelector);

  const onInvertClick = () => {
    dispatch(slice.actions.setInvertMode({ invertMode: !invertMode }));
  };

  return (
    <React.Fragment>
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
              Press the Backspace or Escape key to remove a selected annotation.
            </Typography>
          </ListItemText>
        </ListItem>
      </List>

      <Divider />

      <AnnotationMode />

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
