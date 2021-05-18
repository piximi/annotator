import * as _ from "lodash";
import { CategoryType } from "../../../../../../types/CategoryType";
import * as ReactKonva from "react-konva";
import React, { useEffect, useState } from "react";
import { AnnotationType } from "../../../../../../types/AnnotationType";
import { useSelector } from "react-redux";
import {
  categoriesSelector,
  stageScaleSelector,
} from "../../../../../../store/selectors";
import { imageWidthSelector } from "../../../../../../store/selectors/imageWidthSelector";
import { imageHeightSelector } from "../../../../../../store/selectors/imageHeightSelector";
import { toRGBA } from "../../../../../../image";
import { computeOverlayRoi } from "../../../../../../image/imageHelper";

type AnnotationProps = {
  annotation: AnnotationType;
};

export const SelectedAnnotation = ({ annotation }: AnnotationProps) => {
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
    const t0 = performance.now();
    setImageMask(
      computeOverlayRoi(
        annotation.mask,
        annotation.boundingBox,
        imageWidth,
        imageHeight,
        color
      )
    );
    const t1 = performance.now();
    console.info(`Total computing overlay time: ${t1 - t0} ms`);
  }, [annotation.mask, fill]);

  return (
    <React.Fragment>
      <ReactKonva.Image
        image={imageMask}
        scale={{ x: stageScale, y: stageScale }}
        key={annotation.id}
        x={annotation.boundingBox[0] * stageScale}
        y={annotation.boundingBox[1] * stageScale}
      />
      <ReactKonva.Rect
        visible={false}
        id={annotation.id}
        x={annotation.boundingBox[0] * stageScale}
        y={annotation.boundingBox[1] * stageScale}
        width={annotation.boundingBox[2] - annotation.boundingBox[0]}
        height={annotation.boundingBox[3] - annotation.boundingBox[1]}
        scale={{ x: stageScale, y: stageScale }}
      />
    </React.Fragment>
  );
};
