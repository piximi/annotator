import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { ToolType as OperationType } from "../../../../types/ToolType";
import { Operation } from "../Operation";
import { useStyles } from "./Operations.css";
import { useDispatch, useSelector } from "react-redux";
import { toolTypeSelector } from "../../../../store/selectors";
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
import { useTranslation } from "react-i18next";

type OperationsProps = {
  handleCollapse: (b: boolean) => void;
};

export const Operations = ({ handleCollapse }: OperationsProps) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const activeOperation = useSelector(toolTypeSelector);

  const { t, i18n } = useTranslation();

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
          name={t("Color adjustment")}
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.ColorAdjustment,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.ColorAdjustment}
        >
          <ColorAdjustmentIcon />
        </Operation>

        <Divider />

        <Operation
          name="Rectangular selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.RectangularSelection,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.RectangularSelection}
        >
          <RectangularSelectionIcon />
        </Operation>

        <Operation
          name="Elliptical selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.EllipticalAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.EllipticalAnnotation}
        >
          <EllipticalSelectionIcon />
        </Operation>

        <Operation
          name="Pen selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.PenAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.PenAnnotation}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Lasso selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.LassoAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.LassoAnnotation}
        >
          <LassoSelectionIcon />
        </Operation>

        <Operation
          name="Polygonal selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.PolygonalAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.PolygonalAnnotation}
        >
          <PolygonalSelectionIcon />
        </Operation>

        <Operation
          name="Magnetic selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.MagneticAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.MagneticAnnotation}
        >
          <MagneticSelectionIcon />
        </Operation>

        <Operation
          name="Color selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.ColorAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.ColorAnnotation}
        >
          <ColorSelectionIcon />
        </Operation>

        <Operation
          name="Quick selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.QuickAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.QuickAnnotation}
        >
          <QuickSelectionIcon />
        </Operation>

        <Operation
          name="Object selection"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.ObjectAnnotation,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.ObjectAnnotation}
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
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.Zoom}
        >
          <ZoomIcon />
        </Operation>
      </List>
    </Drawer>
  );
};
