import React, { useEffect, useState } from "react";
import { SelectionMode } from "../../../../../types/SelectionMode";
import { Selection } from "../../../../../types/Selection";
import { SelectedContour } from "../SelectedContour";
import { AnnotationTool } from "../../../../../image/Tool";
import { useSelector } from "react-redux";
import { selectionModeSelector } from "../../../../../store/selectors";

type ConfirmationProps = {
  annotationTool?: AnnotationTool;
  scale: number;
  selected: boolean;
};

export const Confirmation = React.forwardRef<
  React.RefObject<Selection>,
  ConfirmationProps
>(({ annotationTool, scale, selected }, ref) => {
  const selectionMode = useSelector(selectionModeSelector);

  const [points, setPoints] = useState<Array<number>>([]);

  useEffect(() => {
    if (!annotationTool) return;

    if (selectionMode === SelectionMode.New) {
      if (!annotationTool.contour) return;

      setPoints(annotationTool.contour);
    } else {
      if (!annotationTool.annotating || annotationTool.annotated) return;

      const annotated: React.RefObject<Selection> = ref as React.RefObject<Selection>;

      if (!annotated || !annotated.current) return;

      if (!annotated.current.contour) return;

      setPoints(annotated.current.contour);
    }
  }, [annotationTool, ref, selectionMode]);

  return (
    <React.Fragment>
      {selected && <SelectedContour points={points} scale={scale} />}

      {ref && <SelectedContour points={points} scale={scale} />}
    </React.Fragment>
  );
});
