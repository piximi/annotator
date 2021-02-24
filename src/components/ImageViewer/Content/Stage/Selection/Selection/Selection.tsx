import React from "react";
import {
  ColorSelectionOperator,
  EllipticalSelectionOperator,
  LassoSelectionOperator,
  MagneticSelectionOperator,
  ObjectSelectionOperator,
  PolygonalSelectionOperator,
  QuickSelectionOperator,
  RectangularSelectionOperator,
  SelectionOperator,
} from "../../../../../../image/selection";
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
import { PenSelectionOperator } from "../../../../../../image/selection/PenSelectionOperator";

type SelectionProps = {
  operation?: Operation;
  operator?: SelectionOperator;
};

export const Selection = ({ operation, operator }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case Operation.ColorSelection:
      return <ColorSelection operator={operator as ColorSelectionOperator} />;
    case Operation.EllipticalSelection:
      return (
        <EllipticalSelection
          operator={operator as EllipticalSelectionOperator}
        />
      );
    case Operation.LassoSelection:
      return <LassoSelection operator={operator as LassoSelectionOperator} />;
    case Operation.MagneticSelection:
      return (
        <MagneticSelection operator={operator as MagneticSelectionOperator} />
      );
    case Operation.ObjectSelection:
      return <ObjectSelection operator={operator as ObjectSelectionOperator} />;
    case Operation.PenSelection:
      return <PenSelection operator={operator as PenSelectionOperator} />;
    case Operation.PolygonalSelection:
      return (
        <PolygonalSelection operator={operator as PolygonalSelectionOperator} />
      );
    case Operation.RectangularSelection:
      return (
        <RectangularSelection
          operator={operator as RectangularSelectionOperator}
        />
      );
    case Operation.QuickSelection:
      return <QuickSelection operator={operator as QuickSelectionOperator} />;
    default:
      return <React.Fragment />;
  }
};
