import { useEffect } from "react";
import { Selection as SelectionType } from "../../types/Selection";
import { useSelector } from "react-redux";
import { imageInstancesSelector } from "../../store/selectors";
import { AnnotationTool } from "../../image/Tool/AnnotationTool/AnnotationTool";
import { selectedAnnotationSelector } from "../../store/selectors/selectedAnnotationSelector";

export const useInvertMode = (annotationTool: AnnotationTool) => {
  const annotations = useSelector(imageInstancesSelector);
  const selectedAnnotationId = useSelector(selectedAnnotationSelector);

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

    if (annotationTool) return;
  }, []); //fixme invert mode should be a dependency
};
