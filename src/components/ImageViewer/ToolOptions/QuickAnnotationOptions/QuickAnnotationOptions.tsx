import Divider from "@material-ui/core/Divider";
import React, { useState } from "react";
import { SampleList } from "../SampleList";
import { AnnotationMode } from "../AnnotationMode";
import { InformationBox } from "../InformationBox";
import { InvertAnnotation } from "../InvertAnnotation";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Slider from "@material-ui/core/Slider";
import { quickSelectionBrushSizeSelector } from "../../../../store/selectors/quickSelectionBrushSizeSelector";
import { applicationSlice } from "../../../../store/slices";
import { useDispatch, useSelector } from "react-redux";

export const QuickAnnotationOptions = () => {
  const t = useTranslation();

  const quickSelectionBrushSize = useSelector(quickSelectionBrushSizeSelector);

  const [brushSize, setBrushSize] = useState<number>(quickSelectionBrushSize);

  const dispatch = useDispatch();

  const onChange = (event: any, changed: number | number[]) => {
    setBrushSize(changed as number);
  };

  const onChangeCommitted = (event: any, changed: number | number[]) => {
    const payload = { quickSelectionBrushSize: changed as number };
    dispatch(applicationSlice.actions.setQuickSelectionBrushSize(payload));
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Quick annotation")} />

      <Divider />

      <AnnotationMode />

      <Divider />

      <List>
        <ListItem dense>
          <ListItemText
            primary={"Brush size"}
            secondary={
              <Slider
                aria-labelledby="quick-selection-brush-size"
                min={2}
                onChange={onChange}
                onChangeCommitted={onChangeCommitted}
                value={brushSize}
              />
            }
          />
        </ListItem>
      </List>

      <InvertAnnotation />

      <Divider />

      <SampleList />
    </React.Fragment>
  );
};
