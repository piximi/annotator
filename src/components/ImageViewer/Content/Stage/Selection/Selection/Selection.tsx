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
import { ToolType } from "../../../../../../types/ToolType";
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
import { ZoomSelection } from "../ZoomSelection";

type SelectionProps = {
  operation?: ToolType;
  operator?: AnnotationTool | ZoomTool;
  scale: number;
};

export const Selection = ({ operation, operator, scale }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case ToolType.ColorAnnotation:
      return <ColorSelection operator={operator as ColorAnnotationTool} />;
    case ToolType.EllipticalAnnotation:
      return (
        <EllipticalSelection
          operator={operator as EllipticalAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.LassoAnnotation:
      return (
        <LassoSelection
          operator={operator as LassoAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.MagneticAnnotation:
      return (
        <MagneticSelection
          operator={operator as MagneticAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.ObjectAnnotation:
      return (
        <ObjectSelection
          operator={operator as ObjectAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.PenAnnotation:
      return (
        <PenSelection operator={operator as PenAnnotationTool} scale={scale} />
      );
    case ToolType.PolygonalAnnotation:
      return (
        <PolygonalSelection
          operator={operator as PolygonalAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.RectangularSelection:
      return (
        <RectangularSelection
          operator={operator as RectangularAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.Zoom:
      return <ZoomSelection operator={operator as ZoomTool} scale={scale} />;
    case ToolType.QuickAnnotation:
      return <QuickSelection operator={operator as QuickAnnotationTool} />;
    default:
      return <React.Fragment />;
  }
};
