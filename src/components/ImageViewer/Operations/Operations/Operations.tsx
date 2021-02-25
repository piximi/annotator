import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { Operation as OperationType } from "../../../../types/Operation";
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
                operation: OperationType.ColorAdjustment,
              })
            )
          }
          selected={activeOperation === OperationType.ColorAdjustment}
        >
          <ColorAdjustmentIcon />
        </Operation>

        <Divider />

        <Operation
          name="Rectangular selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.RectangularSelection,
              })
            )
          }
          selected={activeOperation === OperationType.RectangularSelection}
        >
          <RectangularSelectionIcon />
        </Operation>

        <Operation
          name="Elliptical selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.EllipticalSelection,
              })
            )
          }
          selected={activeOperation === OperationType.EllipticalSelection}
        >
          <EllipticalSelectionIcon />
        </Operation>

        <Operation
          name="Pen selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.PenSelection,
              })
            )
          }
          selected={activeOperation === OperationType.PenSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Lasso selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.LassoSelection,
              })
            )
          }
          selected={activeOperation === OperationType.LassoSelection}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Polygonal selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.PolygonalSelection,
              })
            )
          }
          selected={activeOperation === OperationType.PolygonalSelection}
        >
          <PolygonalSelectionIcon />
        </Operation>

        <Operation
          name="Magnetic selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.MagneticSelection,
              })
            )
          }
          selected={activeOperation === OperationType.MagneticSelection}
        >
          <MagneticSelectionIcon />
        </Operation>

        <Operation
          name="Color selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.ColorSelection,
              })
            )
          }
          selected={activeOperation === OperationType.ColorSelection}
        >
          <ColorSelectionIcon />
        </Operation>

        <Operation
          name="Quick selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.QuickSelection,
              })
            )
          }
          selected={activeOperation === OperationType.QuickSelection}
        >
          <QuickSelectionIcon />
        </Operation>

        <Operation
          name="Object selection"
          onClick={() =>
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.ObjectSelection,
              })
            )
          }
          selected={activeOperation === OperationType.ObjectSelection}
        >
          <ObjectSelectionIcon />
        </Operation>

        <Divider />

        <Operation
          name="Zoom"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.Zoom,
              })
            );
          }}
          selected={activeOperation === OperationType.Zoom}
        >
          <ZoomIcon />
        </Operation>

        <Operation
          name="Hand"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.Hand,
              })
            );
          }}
          selected={activeOperation === OperationType.Hand}
        >
          <HandIcon />
        </Operation>
      </List>
    </Drawer>
  );
};