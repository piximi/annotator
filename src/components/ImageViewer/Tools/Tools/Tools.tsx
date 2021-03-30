import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { ToolType as OperationType } from "../../../../types/ToolType";
import { Tool } from "../Tool";
import { useStyles } from "./Tools.css";
import { useDispatch, useSelector } from "react-redux";
import { toolTypeSelector } from "../../../../store/selectors";
import { applicationSlice } from "../../../../store";
import {
  ColorSelectionIcon,
  EllipticalSelectionIcon,
  LassoSelectionIcon,
  MagneticSelectionIcon,
  ObjectSelectionIcon,
  PenSelectionIcon,
  PolygonalSelectionIcon,
  QuickSelectionIcon,
  RectangularSelectionIcon,
  SelectionIcon,
  ZoomIcon,
} from "../../../icons";
import { useTranslation } from "../../../../hooks/useTranslation";

export const Tools = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const activeOperation = useSelector(toolTypeSelector);

  const t = useTranslation();

  return (
    <Drawer
      anchor="right"
      className={classes.drawer}
      classes={{ paper: classes.paper }}
      variant="permanent"
    >
      <div className={classes.toolbar} />

      <Divider />

      <Tool
        name={t("Pointer")}
        onClick={() => {
          dispatch(
            applicationSlice.actions.setOperation({
              operation: OperationType.Pointer,
            })
          );
        }}
        selected={activeOperation === OperationType.Pointer}
      >
        <SelectionIcon />
      </Tool>

      <Divider />

      <List>
        <Tool
          name={t("Rectangular annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.RectangularAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.RectangularAnnotation}
        >
          <RectangularSelectionIcon />
        </Tool>

        <Tool
          name={t("Elliptical annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.EllipticalAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.EllipticalAnnotation}
        >
          <EllipticalSelectionIcon />
        </Tool>

        <Tool
          name={t("Pen annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.PenAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.PenAnnotation}
        >
          <PenSelectionIcon />
        </Tool>

        <Tool
          name={t("Lasso annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.LassoAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.LassoAnnotation}
        >
          <LassoSelectionIcon />
        </Tool>

        <Tool
          name={t("Polygonal annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.PolygonalAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.PolygonalAnnotation}
        >
          <PolygonalSelectionIcon />
        </Tool>

        <Tool
          name={t("Magnetic annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.MagneticAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.MagneticAnnotation}
        >
          <MagneticSelectionIcon />
        </Tool>

        <Tool
          name={t("Color annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.ColorAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.ColorAnnotation}
        >
          <ColorSelectionIcon />
        </Tool>

        <Tool
          name={t("Quick annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.QuickAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.QuickAnnotation}
        >
          <QuickSelectionIcon />
        </Tool>

        <Tool
          name={t("Object annotation")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.ObjectAnnotation,
              })
            );
          }}
          selected={activeOperation === OperationType.ObjectAnnotation}
        >
          <ObjectSelectionIcon />
        </Tool>

        <Divider />

        <Tool
          name={t("Zoom")}
          onClick={() => {
            dispatch(
              applicationSlice.actions.setOperation({
                operation: OperationType.Zoom,
              })
            );
          }}
          selected={activeOperation === OperationType.Zoom}
        >
          <ZoomIcon />
        </Tool>
      </List>
    </Drawer>
  );
};
