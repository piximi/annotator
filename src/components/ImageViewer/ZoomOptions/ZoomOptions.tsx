import Radio from "@material-ui/core/Radio";
import React from "react";
import { RadioGroup } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import { zoomModeSelector } from "../../../store/selectors";
import { ZoomMode } from "../../../types/ZoomMode";
import { slice } from "../../../store/slices";

type ZoomOptionsProps = {
  handleRevert: () => void;
};

export const ZoomOptions = ({ handleRevert }: ZoomOptionsProps) => {
  const dispatch = useDispatch();

  const zoomMode = useSelector(zoomModeSelector);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt((event.target as HTMLInputElement).value);

    dispatch(
      slice.actions.setZoomMode({
        zoomMode: value as ZoomMode,
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
          onChange={onChange}
          value={zoomMode}
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
        <Button onClick={handleRevert} variant="contained">
          Actual Size
        </Button>
      </ListItem>
    </List>
  );
};
