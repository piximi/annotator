import { useEffect, useState } from "react";
import { AnnotationType as SelectionType } from "../../types/AnnotationType";
import { useDispatch, useSelector } from "react-redux";
import {
  imageInstancesSelector,
  invertModeSelector,
} from "../../store/selectors";
import { AnnotationTool } from "../../image/Tool/AnnotationTool/AnnotationTool";
import { selectedAnnotationSelector } from "../../store/selectors/selectedAnnotationSelector";
import { applicationSlice } from "../../store/slices";

export const useInvertMode = (annotationTool: AnnotationTool | undefined) => {
  const annotations = useSelector(imageInstancesSelector);
  const invertMode = useSelector(invertModeSelector);
  const selectedAnnotationId = useSelector(selectedAnnotationSelector);

  const dispatch = useDispatch();

  const [
    invertedAnnotation,
    setInvertedAnnotation,
  ] = useState<SelectionType | null>(null);

  useEffect(() => {
    if (!annotationTool) return;

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

    //FIXME: This logic should not be part of stage, it should be something that our annotationTool does
    const invertedInstance = {
      ...selectedInstance,
      boundingBox: invertedBoundingBox,
      contour: invertedContour,
      mask: invertedMask,
    };

    setInvertedAnnotation(invertedInstance);

    dispatch(applicationSlice.actions.setAnnotated({ annotated: true }));
  }, [invertMode]);

  return invertedAnnotation;
};
