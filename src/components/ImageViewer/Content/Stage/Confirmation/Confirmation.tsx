import React, { useEffect, useState } from "react";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { Selection } from "../../../../../types/Selection";
import { SelectedContour } from "../SelectedContour";
import { AnnotationTool } from "../../../../../image/Tool";
import { useSelector } from "react-redux";
import { selectionModeSelector } from "../../../../../store/selectors";
import * as _ from "lodash";

type ConfirmationProps = {
  annotationTool?: AnnotationTool;
  imagePosition: { x: number; y: number };
  scale: number;
  selected: boolean;
  stageScale: { x: number; y: number };
};

export const Confirmation = React.forwardRef<
  React.RefObject<Selection>,
  ConfirmationProps
>(({ annotationTool, imagePosition, scale, selected, stageScale }, ref) => {
  const selectionMode = useSelector(selectionModeSelector);

  const [points, setPoints] = useState<Array<number>>([]);

  useEffect(() => {
    if (!annotationTool) return;

    if (selectionMode === SelectionMode.New) {
      if (!annotationTool.contour) return;

      const stagedPoints: Array<number> = _.flatten(
        _.map(_.chunk(annotationTool.contour, 2), (coords: Array<number>) => {
          return [
            coords[0] + imagePosition.x / stageScale.x,
            coords[1] + imagePosition.y / stageScale.y,
          ];
        })
      );

      setPoints(stagedPoints);
    } else {
      if (!annotationTool.annotating || annotationTool.annotated) return;

      const annotated: React.RefObject<Selection> = ref as React.RefObject<Selection>;

      if (!annotated || !annotated.current) return;

      if (!annotated.current.contour) return;

      const stagedPoints: Array<number> = _.flatten(
        _.map(
          _.chunk(annotated.current.contour, 2),
          (coords: Array<number>) => {
            return [
              coords[0] + imagePosition.x / stageScale.x,
              coords[1] + imagePosition.y / stageScale.y,
            ];
          }
        )
      );

      setPoints(stagedPoints);
    }
  }, [annotationTool, ref, selectionMode]);

  return (
    <React.Fragment>
      {selected && (
        <SelectedContour
          imagePosition={imagePosition}
          points={points}
          scale={scale}
          stageScale={stageScale}
        />
      )}

      {ref && (
        <SelectedContour
          imagePosition={imagePosition}
          points={points}
          scale={scale}
          stageScale={stageScale}
        />
      )}
    </React.Fragment>
  );
});
