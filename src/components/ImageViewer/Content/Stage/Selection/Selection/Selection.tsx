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
import { ImageViewerOperation } from "../../../../../../types/ImageViewerOperation";
import { LassoSelection } from "../LassoSelection";
import { MagneticSelection } from "../MagneticSelection";
import { ObjectSelection } from "../ObjectSelection";
import { PolygonalSelection } from "../PolygonalSelection";
import { RectangularSelection } from "../RectangularSelection";
import { ColorSelection } from "../ColorSelection/ColorSelection";
import { QuickSelection } from "../QuickSelection/QuickSelection";

type SelectionProps = {
  operation?: ImageViewerOperation;
  operator?: SelectionOperator;
};

export const Selection = ({ operation, operator }: SelectionProps) => {
  if (!operation || !operator) return <React.Fragment />;

  switch (operation) {
    case ImageViewerOperation.ColorSelection:
      return <ColorSelection operator={operator as ColorSelectionOperator} />;
    case ImageViewerOperation.EllipticalSelection:
      return (
        <EllipticalSelection
          operator={operator as EllipticalSelectionOperator}
        />
      );
    case ImageViewerOperation.LassoSelection:
      return <LassoSelection operator={operator as LassoSelectionOperator} />;
    case ImageViewerOperation.MagneticSelection:
      return (
        <MagneticSelection operator={operator as MagneticSelectionOperator} />
      );
    case ImageViewerOperation.ObjectSelection:
      return <ObjectSelection operator={operator as ObjectSelectionOperator} />;
    case ImageViewerOperation.PolygonalSelection:
      return (
        <PolygonalSelection operator={operator as PolygonalSelectionOperator} />
      );
    case ImageViewerOperation.RectangularSelection:
      return (
        <RectangularSelection
          operator={operator as RectangularSelectionOperator}
        />
      );
    case ImageViewerOperation.QuickSelection:
      return <QuickSelection operator={operator as QuickSelectionOperator} />;
    default:
      return <React.Fragment />;
  }
};
