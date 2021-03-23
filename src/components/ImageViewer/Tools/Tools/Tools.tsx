import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import React from "react";
import { ToolType as OperationType } from "../../../../types/ToolType";
import { Tool } from "../Tool";
import { useStyles } from "./Tools.css";
import { useDispatch, useSelector } from "react-redux";
import { toolTypeSelector } from "../../../../store/selectors";
import { slice } from "../../../../store";
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

type OperationsProps = {
  handleCollapse: (b: boolean) => void;
};

export const Tools = ({ handleCollapse }: OperationsProps) => {
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
            slice.actions.setOperation({
              operation: OperationType.Pointer,
            })
          );
          handleCollapse(true);
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
          name={t("Elliptical annotation")}
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
          name={t("Pen annotation")}
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
          name={t("Lasso annotation")}
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
          name={t("Polygonal annotation")}
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
          name={t("Magnetic annotation")}
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
          name={t("Color annotation")}
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
          name={t("Quick annotation")}
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
          name={t("Object annotation")}
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
          name={t("Zoom")}
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
      </List>
    </Drawer>
  );
};
