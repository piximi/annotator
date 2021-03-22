import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { ToolType as OperationType } from "../../../../types/ToolType";
import { Tool } from "../Tool";
import { useStyles } from "./Tools.css";
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
  PenSelectionIcon,
  PolygonalSelectionIcon,
  QuickSelectionIcon,
  RectangularSelectionIcon,
  ZoomIcon,
} from "../../../icons";
import { useTranslation } from "react-i18next";
import { ObjectSelection } from "../../Content/Stage/Selection/ObjectSelection";

type OperationsProps = {
  handleCollapse: (b: boolean) => void;
};

export const Tools = ({ handleCollapse }: OperationsProps) => {
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
        <Tool
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
        </Tool>

        <Divider />

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
          <PenSelectionIcon />
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Tool
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
        </Tool>

        <Divider />

        <Tool
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
        </Tool>
        <Tool
          name="Pointer"
          onClick={() => {
            dispatch(
              slice.actions.setOperation({
                operation: OperationType.Pointer,
              })
            );
            handleCollapse(true);
          }}
          selected={activeOperation === OperationType.Pointer}
        >
          <ObjectSelectionIcon />
        </Tool>
      </List>
    </Drawer>
  );
};
