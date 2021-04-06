import React, { useEffect, useState } from "react";
import { AnnotationModeType } from "../../../../../types/AnnotationModeType";
import { AnnotationType } from "../../../../../types/AnnotationType";
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
};

export const Confirmation = React.forwardRef<
  React.RefObject<AnnotationType>,
  ConfirmationProps
>(({ annotationTool, imagePosition, selected }, ref) => {
  const selectionMode = useSelector(selectionModeSelector);

  const [points, setPoints] = useState<Array<number>>([]);

  useEffect(() => {
    if (!annotationTool) return;

    if (selectionMode === AnnotationModeType.New) {
      if (!annotationTool.contour) return;

      const stagedPoints: Array<number> = _.flatten(
        _.map(_.chunk(annotationTool.contour, 2), (coords: Array<number>) => {
          return [coords[0] + imagePosition.x, coords[1] + imagePosition.y];
        })
      );

      setPoints(stagedPoints);
    } else {
      if (!annotationTool.annotating || annotationTool.annotated) return;

      const annotated: React.RefObject<AnnotationType> = ref as React.RefObject<AnnotationType>;

      if (!annotated || !annotated.current) return;

      if (!annotated.current.contour) return;

      const stagedPoints: Array<number> = _.flatten(
        _.map(
          _.chunk(annotated.current.contour, 2),
          (coords: Array<number>) => {
            return [coords[0] + imagePosition.x, coords[1] + imagePosition.y];
          }
        )
      );

      setPoints(stagedPoints);
    }
  }, [annotationTool, ref, selectionMode]);

  return (
    <React.Fragment>
      {selected && <SelectedContour points={points} />}

      {ref && <SelectedContour points={points} />}
    </React.Fragment>
  );
});
