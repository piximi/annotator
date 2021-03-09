import React from "react";
import {
  ColorAnnotationTool,
  EllipticalAnnotationTool,
  LassoAnnotationTool,
  MagneticAnnotationTool,
  ObjectAnnotationTool,
  PolygonalAnnotationTool,
  QuickAnnotationTool,
  RectangularAnnotationTool,
  AnnotationTool,
} from "../../../../../../image/Tool/AnnotationTool";
import { EllipticalSelection } from "../EllipticalSelection";
import { Tool } from "../../../../../../types/Tool";
import { LassoSelection } from "../LassoSelection";
import { MagneticSelection } from "../MagneticSelection";
import { ObjectSelection } from "../ObjectSelection";
import { PolygonalSelection } from "../PolygonalSelection";
import { RectangularSelection } from "../RectangularSelection";
import { ColorSelection } from "../ColorSelection/ColorSelection";
import { QuickSelection } from "../QuickSelection/QuickSelection";
import { PenSelection } from "../PenSelection";

import { ZoomTool } from "../../../../../../image/Tool/ZoomTool";
import { PenAnnotationTool } from "../../../../../../image/Tool/AnnotationTool";

type SelectionProps = {
  operation?: Tool;
  operator?: AnnotationTool | ZoomTool;
};

export const Selection = ({ operation, operator }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case Tool.ColorAnnotation:
      return <ColorSelection operator={operator as ColorAnnotationTool} />;
    case Tool.EllipticalAnnotation:
      return (
        <EllipticalSelection operator={operator as EllipticalAnnotationTool} />
      );
    case Tool.LassoAnnotation:
      return <LassoSelection operator={operator as LassoAnnotationTool} />;
    case Tool.MagneticAnnotation:
      return (
        <MagneticSelection operator={operator as MagneticAnnotationTool} />
      );
    case Tool.ObjectAnnotation:
      return <ObjectSelection operator={operator as ObjectAnnotationTool} />;
    case Tool.PenAnnotation:
      return <PenSelection operator={operator as PenAnnotationTool} />;
    case Tool.PolygonalAnnotation:
      return (
        <PolygonalSelection operator={operator as PolygonalAnnotationTool} />
      );
    case Tool.RectangularSelection:
      return (
        <RectangularSelection
          operator={operator as RectangularAnnotationTool}
        />
      );
    case Tool.Zoom:
      return <RectangularSelection operator={operator as ZoomTool} />;
    case Tool.QuickAnnotation:
      return <QuickSelection operator={operator as QuickAnnotationTool} />;
    default:
      return <React.Fragment />;
  }
};
