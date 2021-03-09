import React from "react";
import {
  ColorSelectionTool,
  EllipticalSelectionTool,
  LassoSelectionTool,
  MagneticSelectionTool,
  ObjectSelectionTool,
  PolygonalSelectionTool,
  QuickSelectionTool,
  RectangularSelectionTool,
  SelectionTool,
} from "../../../../../../image/Tool/SelectionTool";
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
import { PenSelectionTool } from "../../../../../../image/Tool/SelectionTool/PenSelectionTool/PenSelectionOperator";

type SelectionProps = {
  operation?: Operation;
  operator?: SelectionTool;
};

export const Selection = ({ operation, operator }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case Operation.ColorSelection:
      return <ColorSelection operator={operator as ColorSelectionTool} />;
    case Operation.EllipticalSelection:
      return (
        <EllipticalSelection operator={operator as EllipticalSelectionTool} />
      );
    case Operation.LassoSelection:
      return <LassoSelection operator={operator as LassoSelectionTool} />;
    case Operation.MagneticSelection:
      return <MagneticSelection operator={operator as MagneticSelectionTool} />;
    case Operation.ObjectSelection:
      return <ObjectSelection operator={operator as ObjectSelectionTool} />;
    case Operation.PenSelection:
      return <PenSelection operator={operator as PenSelectionTool} />;
    case Operation.PolygonalSelection:
      return (
        <PolygonalSelection operator={operator as PolygonalSelectionTool} />
      );
    case Operation.RectangularSelection:
      return (
        <RectangularSelection operator={operator as RectangularSelectionTool} />
      );
    case Operation.QuickSelection:
      return <QuickSelection operator={operator as QuickSelectionTool} />;
    default:
      return <React.Fragment />;
  }
};
