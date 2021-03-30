import React from "react";
import {
  ColorAnnotationTool,
  EllipticalAnnotationTool,
  LassoAnnotationTool,
  MagneticAnnotationTool,
  ObjectAnnotationTool,
  PenAnnotationTool,
  PolygonalAnnotationTool,
  QuickAnnotationTool,
  RectangularAnnotationTool,
} from "../../../../../../image/Tool";
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
import { ZoomSelection } from "../ZoomSelection";
import { Tool } from "../../../../../../image/Tool";

type SelectionProps = {
  imagePosition: { x: number; y: number };
  scale: number;
  stageScale: { x: number; y: number };
  tool?: Tool;
  toolType?: ToolType;
};

export const Selection = ({
  imagePosition,
  scale,
  stageScale,
  tool,
  toolType,
}: SelectionProps) => {
  if (!toolType || !tool) return <React.Fragment />;

  switch (toolType) {
    case ToolType.ColorAnnotation:
      return (
        <ColorSelection
          operator={tool as ColorAnnotationTool}
          stageScale={stageScale}
        />
      );
    case ToolType.EllipticalAnnotation:
      return (
        <EllipticalSelection
          operator={tool as EllipticalAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.LassoAnnotation:
      return (
        <LassoSelection operator={tool as LassoAnnotationTool} scale={scale} />
      );
    case ToolType.MagneticAnnotation:
      return (
        <MagneticSelection
          imagePosition={imagePosition}
          operator={tool as MagneticAnnotationTool}
          scale={scale}
          stageScale={stageScale}
        />
      );
    case ToolType.ObjectAnnotation:
      return (
        <ObjectSelection
          operator={tool as ObjectAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.PenAnnotation:
      return (
        <PenSelection operator={tool as PenAnnotationTool} scale={scale} />
      );
    case ToolType.PolygonalAnnotation:
      return (
        <PolygonalSelection
          operator={tool as PolygonalAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.RectangularSelection:
      return (
        <RectangularSelection
          operator={tool as RectangularAnnotationTool}
          scale={scale}
        />
      );
    case ToolType.Zoom:
      return <ZoomSelection operator={tool as ZoomTool} scale={scale} />;
    case ToolType.QuickAnnotation:
      return (
        <QuickSelection
          operator={tool as QuickAnnotationTool}
          stageScale={stageScale}
        />
      );
    default:
      return <React.Fragment />;
  }
};
