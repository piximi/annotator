import Radio from "@material-ui/core/Radio";
import React from "react";
import { RadioGroup } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { ZoomMode } from "../../../../types/ZoomMode";
import { slice } from "../../../../store";
import Checkbox from "@material-ui/core/Checkbox";
import { zoomSettingsSelector } from "../../../../store/selectors";
import ListSubheader from "@material-ui/core/ListSubheader";
import { NewTooltip } from "../AnnotationMode/NewTooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { SelectionMode } from "../../../../types/SelectionMode";
import { AddTooltip } from "../AnnotationMode/AddTooltip";
import { SubtractTooltip } from "../AnnotationMode/SubtractTooltip";
import { IntersectionTooltip } from "../AnnotationMode/IntersectionTooltip";

type ZoomOptionsProps = {
  handleRevert: () => void;
};

export const ZoomOptions = ({ handleRevert }: ZoomOptionsProps) => {
  const dispatch = useDispatch();

  const zoomSettings = useSelector(zoomSettingsSelector);

  const onZoomModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);

    dispatch(
      slice.actions.setZoomMode({
        zoomMode: value as ZoomMode,
      })
    );
  };

  const onCenterChange = () => {
    dispatch(
      slice.actions.setZoomAutomaticCentering({
        zoomAutomaticCentering: !zoomSettings.zoomAutomaticCentering,
      })
    );
  };

  return (
    <React.Fragment>
      <List dense>
        <RadioGroup
          defaultValue={ZoomMode.In}
          aria-label="annotation mode"
          name="annotation-mode"
          onChange={onZoomModeChange}
          value={zoomSettings.zoomMode}
        >
          <List
            component="nav"
            subheader={<ListSubheader component="div">Zoom mode</ListSubheader>}
          >
            <ListItem button dense>
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  tabIndex={-1}
                  value={ZoomMode.In}
                />
              </ListItemIcon>

              <ListItemText primary="Zoom in" />
            </ListItem>

            <ListItem button dense>
              <ListItemIcon>
                <Radio
                  disableRipple
                  edge="start"
                  tabIndex={-1}
                  value={ZoomMode.Out}
                />
              </ListItemIcon>

              <ListItemText primary="Zoom out" />
            </ListItem>
          </List>
        </RadioGroup>
      </List>

      <List dense>
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={zoomSettings.zoomAutomaticCentering}
                onChange={onCenterChange}
                name="center"
              />
            }
            label="Center image automatically"
          />
        </ListItem>

        <ListItem>
          <Button onClick={handleRevert} variant="contained">
            Actual Size
          </Button>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
