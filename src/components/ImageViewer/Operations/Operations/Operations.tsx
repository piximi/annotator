import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { Operation } from "../../../../types/ImageViewerOperation";
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
                operation: Operation.ColorAdjustment,
              })
            )
          }
          selected={activeOperation === Operation.ColorAdjustment}
        >
          <ColorAdjustmentIcon />
        </Operation>

        <Divider />

        <Operation
          name="Rectangular selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.RectangularSelection,
              })
            )
          }
          selected={activeOperation === Operation.RectangularSelection}
        >
          <RectangularSelectionIcon />
        </Operation>

        <Operation
          name="Elliptical selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.EllipticalSelection,
              })
            )
          }
          selected={activeOperation === Operation.EllipticalSelection}
        >
          <EllipticalSelectionIcon />
        </Operation>

        <Operation
          name="Pen selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.PenSelection,
              })
            )
          }
          selected={activeOperation === Operation.PenSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Lasso selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.LassoSelection,
              })
            )
          }
          selected={activeOperation === Operation.LassoSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Polygonal selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.PolygonalSelection,
              })
            )
          }
          selected={activeOperation === Operation.PolygonalSelection}
        >
          <PolygonalSelectionIcon />
        </Operation>

        <Operation
          name="Magnetic selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.MagneticSelection,
              })
            )
          }
          selected={activeOperation === Operation.MagneticSelection}
        >
          <MagneticSelectionIcon />
        </Operation>

        <Operation
          name="Color selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.ColorSelection,
              })
            )
          }
          selected={activeOperation === Operation.ColorSelection}
        >
          <ColorSelectionIcon />
        </Operation>

        <Operation
          name="Quick selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.QuickSelection,
              })
            )
          }
          selected={activeOperation === Operation.QuickSelection}
        >
          <QuickSelectionIcon />
        </Operation>

        <Operation
          name="Object selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: Operation.ObjectSelection,
              })
            )
          }
          selected={activeOperation === Operation.ObjectSelection}
        >
          <ObjectSelectionIcon />
        </Operation>

        <Divider />

        <Operation
          name="Zoom"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: Operation.Zoom,
              })
            );
          }}
          selected={activeOperation === Operation.Zoom}
        >
          <ZoomIcon />
        </Operation>

        <Operation
          name="Hand"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: Operation.Hand,
              })
            );
          }}
          selected={activeOperation === Operation.Hand}
        >
          <HandIcon />
        </Operation>
      </List>
    </Drawer>
  );
};
