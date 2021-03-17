import React, { useEffect, useState } from "react";
import { Selection as SelectionType } from "../../types/Selection";
import { useSelector } from "react-redux";
import {
  imageInstancesSelector,
  invertModeSelector,
} from "../../store/selectors";
import { AnnotationTool } from "../../image/Tool/AnnotationTool/AnnotationTool";
import { selectedAnnotationSelector } from "../../store/selectors/selectedAnnotationSelector";

export const useInvertMode = (annotationTool: AnnotationTool) => {
  const annotations = useSelector(imageInstancesSelector);
  const invertMode = useSelector(invertModeSelector);
  const selectedAnnotationId = useSelector(selectedAnnotationSelector);

  const [
    invertedAnnotation,
    setInvertedAnnotation,
  ] = useState<SelectionType | null>(null);

  useEffect(() => {
    if (!annotations || !selectedAnnotationId) return;

    const selectedInstance: SelectionType = annotations.filter(
      (instance: SelectionType) => {
        return instance.id === selectedAnnotationId;
      }
    )[0];

    if (
      !selectedInstance ||
      !selectedInstance.mask ||
      !selectedInstance.contour
    )
      return;

    if (!annotationTool) return;

    const invertedMask = annotationTool.invert(selectedInstance.mask, true);

    const invertedContour = annotationTool.invertContour(
      selectedInstance.contour
    );

    const invertedBoundingBox = annotationTool.computeBoundingBoxFromContours(
      invertedContour
    );

    annotationTool.mask = invertedMask;
    annotationTool.boundingBox = invertedBoundingBox;
    annotationTool.contour = invertedContour;

    const invertedInstance = {
      ...selectedInstance,
      boundingBox: invertedBoundingBox,
      contour: invertedContour,
      mask: invertedMask,
    };

    setInvertedAnnotation(invertedInstance);
  }, [invertMode]);

  return invertedAnnotation;
};
