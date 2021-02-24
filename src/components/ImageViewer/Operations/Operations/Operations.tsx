import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { ImageViewerOperation } from "../../../../types/ImageViewerOperation";
import { Operation } from "../Operation";
import { useStyles } from "./Operations.css";
import { useDispatch, useSelector } from "react-redux";
import { operationSelector } from "../../../../store/selectors";
import { slice } from "../../../../store/slices";
import {
  ColorAdjustmentIcon,
  ColorSelectionIcon,
  EllipticalSelectionIcon,
  HandIcon,
  LassoSelectionIcon,
  MagneticSelectionIcon,
  ObjectSelectionIcon,
  PolygonalSelectionIcon,
  QuickSelectionIcon,
  RectangularSelectionIcon,
  ZoomIcon,
} from "../../../icons";

export const Operations = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const activeOperation = useSelector(operationSelector);

  return (
    <Drawer
      anchor="right"
      className={classes.drawer}
      classes={{ paper: classes.paper }}
      variant="permanent"
    >
      <div className={classes.toolbar} />

      <Divider />

      <List>
        <Operation
          name="Color adjustment"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.ColorAdjustment,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.ColorAdjustment}
        >
          <ColorAdjustmentIcon />
        </Operation>

        <Divider />

        <Operation
          name="Rectangular selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.RectangularSelection,
              })
            )
          }
          selected={
            activeOperation === ImageViewerOperation.RectangularSelection
          }
        >
          <RectangularSelectionIcon />
        </Operation>

        <Operation
          name="Elliptical selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.EllipticalSelection,
              })
            )
          }
          selected={
            activeOperation === ImageViewerOperation.EllipticalSelection
          }
        >
          <EllipticalSelectionIcon />
        </Operation>

        <Operation
          name="Pen selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.PenSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.PenSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Lasso selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.LassoSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.LassoSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Polygonal selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.PolygonalSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.PolygonalSelection}
        >
          <PolygonalSelectionIcon />
        </Operation>

        <Operation
          name="Magnetic selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.MagneticSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.MagneticSelection}
        >
          <MagneticSelectionIcon />
        </Operation>

        <Operation
          name="Color selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.ColorSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.ColorSelection}
        >
          <ColorSelectionIcon />
        </Operation>

        <Operation
          name="Quick selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.QuickSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.QuickSelection}
        >
          <QuickSelectionIcon />
        </Operation>

        <Operation
          name="Object selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.ObjectSelection,
              })
            )
          }
          selected={activeOperation === ImageViewerOperation.ObjectSelection}
        >
          <ObjectSelectionIcon />
        </Operation>

        <Divider />

        <Operation
          name="Zoom"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.Zoom,
              })
            );
          }}
          selected={activeOperation === ImageViewerOperation.Zoom}
        >
          <ZoomIcon />
        </Operation>

        <Operation
          name="Hand"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: ImageViewerOperation.Hand,
              })
            );
          }}
          selected={activeOperation === ImageViewerOperation.Hand}
        >
          <HandIcon />
        </Operation>
      </List>
    </Drawer>
  );
};
