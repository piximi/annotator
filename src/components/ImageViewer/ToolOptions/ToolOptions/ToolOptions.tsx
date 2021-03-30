import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import React from "react";
import { useStyles } from "./ToolOptions.css";
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
import { ToolType } from "../../../../types/ToolType";
import { RectangularAnnotationOptions } from "../RectangularAnnotationOptions";
import { EllipticalAnnotationOptions } from "../EllipticalAnnotationOptions";
import { FreehandAnnotationOptions } from "../FreehandAnnotationOptions";
import { LassoAnnotationOptions } from "../LassoAnnotationOptions";
import { PolygonalAnnotationOptions } from "../PolygonalAnnotationOptions";
import { MagneticAnnotationOptions } from "../MagneticAnnotationOptions";
import { ColorAnnotationOptions } from "../ColorAnnotationOptions";
import { QuickAnnotationOptions } from "../QuickAnnotationOptions";
import { ObjectAnnotationOptions } from "../ObjectAnnotationOptions";
import { ZoomOptions } from "../ZoomOptions";
import { useSelector } from "react-redux";
import { toolTypeSelector } from "../../../../store/selectors";
import { useTranslation } from "react-i18next";

export const ToolOptions = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const activeOperation = useSelector(toolTypeSelector);

  const operations = [
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorAdjustmentIcon />,
      method: ToolType.ColorAdjustment,
      name: t("Color adjustment"),
      options: <React.Fragment />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <RectangularSelectionIcon />,
      method: ToolType.RectangularAnnotation,
      name: "Rectangular selection",
      options: <RectangularAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <EllipticalSelectionIcon />,
      method: ToolType.EllipticalAnnotation,
      name: "Elliptical selection",
      options: <EllipticalAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PenSelectionIcon />,
      method: ToolType.PenAnnotation,
      name: "Pen selection",
      options: <FreehandAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <LassoSelectionIcon />,
      method: ToolType.LassoAnnotation,
      name: "Lasso selection",
      options: <LassoAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <PolygonalSelectionIcon />,
      method: ToolType.PolygonalAnnotation,
      name: "Polygonal selection",
      options: <PolygonalAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <MagneticSelectionIcon />,
      method: ToolType.MagneticAnnotation,
      name: "Magnetic selection",
      options: <MagneticAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ColorSelectionIcon />,
      method: ToolType.ColorAnnotation,
      name: "Color selection",
      options: <ColorAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <QuickSelectionIcon />,
      method: ToolType.QuickAnnotation,
      name: "Quick selection",
      options: <QuickAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <ObjectSelectionIcon />,
      method: ToolType.ObjectAnnotation,
      name: "Object selection",
      options: <ObjectAnnotationOptions />,
    },
    {
      description: "Nam a facilisis velit, sit amet interdum ante. In sodales.",
      icon: <HandIcon />,
      method: ToolType.Hand,
      name: "Hand",
      options: <React.Fragment />,
    },
    {
      description: "Description of zoom here.",
      icon: <ZoomIcon />,
      method: ToolType.Zoom,
      name: "Zoom",
      options: <ZoomOptions />,
    },
    {
      description: "Description of pointer here.",
      icon: <ObjectSelectionIcon />,
      method: ToolType.Pointer,
      name: "Pointer",
      options: <React.Fragment />,
    },
  ];

  return (
    <Drawer
      anchor="right"
      className={classes.options}
      classes={{ paper: classes.settingsPaper }}
      variant="permanent"
    >
      <div className={classes.settingsToolbar} />

      <Divider />

      {
        operations[
          operations.findIndex(
            (operation) => operation.method === activeOperation
          )
        ].options
      }
    </Drawer>
  );
};
