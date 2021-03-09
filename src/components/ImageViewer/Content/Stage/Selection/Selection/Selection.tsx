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
import { Operation } from "../../../../../../types/Operation";
import { LassoSelection } from "../LassoSelection";
import { MagneticSelection } from "../MagneticSelection";
import { ObjectSelection } from "../ObjectSelection";
import { PolygonalSelection } from "../PolygonalSelection";
import { RectangularSelection } from "../RectangularSelection";
import { ColorSelection } from "../ColorSelection/ColorSelection";
import { QuickSelection } from "../QuickSelection/QuickSelection";
import { PenSelection } from "../PenSelection";
import { PenSelectionTool } from "../../../../../../image/Tool/AnnotationTool/PenAnnotationTool/PenSelectionOperator";

type SelectionProps = {
  operation?: Operation;
  operator?: AnnotationTool;
};

export const Selection = ({ operation, operator }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case Operation.ColorSelection:
      return <ColorSelection operator={operator as ColorAnnotationTool} />;
    case Operation.EllipticalSelection:
      return (
        <EllipticalSelection operator={operator as EllipticalAnnotationTool} />
      );
    case Operation.LassoSelection:
      return <LassoSelection operator={operator as LassoAnnotationTool} />;
    case Operation.MagneticSelection:
      return (
        <MagneticSelection operator={operator as MagneticAnnotationTool} />
      );
    case Operation.ObjectSelection:
      return <ObjectSelection operator={operator as ObjectAnnotationTool} />;
    case Operation.PenSelection:
      return <PenSelection operator={operator as PenSelectionTool} />;
    case Operation.PolygonalSelection:
      return (
        <PolygonalSelection operator={operator as PolygonalAnnotationTool} />
      );
    case Operation.RectangularSelection:
      return (
        <RectangularSelection
          operator={operator as RectangularAnnotationTool}
        />
      );
    case Operation.QuickSelection:
      return <QuickSelection operator={operator as QuickAnnotationTool} />;
    default:
      return <React.Fragment />;
  }
};
