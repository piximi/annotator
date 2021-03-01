import React, { useState } from "react";
import { SelectionOptions } from "../SelectionOptions";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import { useDispatch, useSelector } from "react-redux";
import { slice } from "../../../../store/slices";
import { penSelectionBrushSizeSelector } from "../../../../store/selectors/penSelectionBrushSizeSelector";

export const PenSelectionOptions = () => {
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

      <Slider
        aria-labelledby="brush-size"
        onChange={onChange}
        value={penSelectionBrushSizeBrushSize}
      />
    </React.Fragment>
  );
};
