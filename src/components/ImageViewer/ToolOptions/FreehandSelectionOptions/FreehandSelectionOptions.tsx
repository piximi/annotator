import React from "react";
import { SelectionOptions } from "../SelectionOptions";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import { useDispatch, useSelector } from "react-redux";
import { slice } from "../../../../store";
import { penSelectionBrushSizeSelector } from "../../../../store/selectors/penSelectionBrushSizeSelector";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

export const FreehandSelectionOptions = () => {
  const dispatch = useDispatch();

  const penSelectionBrushSizeBrushSize = useSelector(
    penSelectionBrushSizeSelector
  );

  const onChange = (event: any, changed: number | number[]) => {
    const payload = { penSelectionBrushSize: changed as number };

    dispatch(slice.actions.setPenSelectionBrushSize(payload));
  };

  return (
    <React.Fragment>
      <SelectionOptions />

      <Divider />

      <List>
        <ListItem dense>
          <ListItemText
            primary={"Brush size"}
            secondary={
              <Slider
                aria-labelledby="pen-selection-brush-size"
                onChange={onChange}
                value={penSelectionBrushSizeBrushSize}
              />
            }
          />
        </ListItem>
      </List>
    </React.Fragment>
  );
};
