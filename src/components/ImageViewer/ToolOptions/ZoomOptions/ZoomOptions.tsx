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
    <List>
      <ListItem dense>
        <ListItemText primary={"Mode"} secondary={"Select the zoom mode."} />

        <RadioGroup
          defaultValue={ZoomMode.In}
          name="zoom-mode"
          onChange={onZoomModeChange}
          value={zoomSettings.zoomMode}
        >
          <FormControlLabel
            control={<Radio tabIndex={-1} />}
            label="Zoom In"
            value={ZoomMode.In}
          />

          <FormControlLabel
            control={<Radio tabIndex={-1} />}
            label="Zoom out"
            value={ZoomMode.Out}
          />
        </RadioGroup>
      </ListItem>

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
  );
};
