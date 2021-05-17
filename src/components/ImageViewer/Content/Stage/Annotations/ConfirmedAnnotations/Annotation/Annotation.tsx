import React, { useEffect, useState } from "react";
import { CategoryType } from "../../../../../../../types/CategoryType";
import * as ReactKonva from "react-konva";
import * as _ from "lodash";
import { AnnotationType } from "../../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../../../store/selectors";
import { computeOverlayMask } from "../../../../../../../image/imageHelper";
import { imageWidthSelector } from "../../../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../../../store/selectors/imageHeightSelector";
import { toRGBA } from "../../../../../../../image";

type AnnotationProps = {
  annotation: AnnotationType;
};

export const Annotation = ({ annotation }: AnnotationProps) => {
  const categories = useSelector(categoriesSelector);
  const stageScale = useSelector(stageScaleSelector);

  const imageWidth = useSelector(imageWidthSelector);
  const imageHeight = useSelector(imageHeightSelector);

  const [imageMask, setImageMask] = useState<HTMLImageElement>();

  const fill = _.find(
    categories,
    (category: CategoryType) => category.id === annotation.categoryId
  )?.color;

  useEffect(() => {
    if (!annotation.mask || !imageWidth || !imageHeight) return;
    if (!fill) return;
    const color = toRGBA(fill, 0);
    setImageMask(
      computeOverlayMask(annotation.mask, imageWidth, imageHeight, color)
    );
  }, [annotation.mask]);

  if (!annotation || !annotation.contour) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image
        image={imageMask}
        scale={{ x: stageScale, y: stageScale }}
      />
    </ReactKonva.Group>
  );
};
