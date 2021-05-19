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
import { colorOverlayROI } from "../../../../../../../image/imageHelper";
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
    const boxWidth = annotation.boundingBox[2] - annotation.boundingBox[0];
    const boxHeight = annotation.boundingBox[3] - annotation.boundingBox[1];
    if (Math.round(boxWidth) <= 0 || Math.round(boxHeight) <= 0) return;
    const color = toRGBA(fill, 0);
    setImageMask(
      colorOverlayROI(
        annotation.mask,
        annotation.boundingBox,
        imageWidth,
        imageHeight,
        color
      )
    );
  }, [annotation.mask, fill]);

  if (!annotation) return <React.Fragment />;

  return (
    <ReactKonva.Group>
      <ReactKonva.Image
        id={annotation.id}
        image={imageMask}
        scale={{ x: stageScale, y: stageScale }}
        x={annotation.boundingBox[0] * stageScale}
        y={annotation.boundingBox[1] * stageScale}
      />
    </ReactKonva.Group>
  );
};
