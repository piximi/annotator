import { HistoryStateType } from "../../types/HistoryStateType";
import { AnnotationType } from "../../types/AnnotationType";
import { CategoryType } from "../../types/CategoryType";
import { SerializedAnnotationType } from "../../types/SerializedAnnotationType";

export const saveAnnotationsSelector = ({
  state,
}: {
  state: HistoryStateType;
}): Array<SerializedAnnotationType> => {
  const image = state.present.image;

  if (!image) return [];

  const columns = {
    imageChannels: image.shape.channels,
    imageChecksum: "",
    imageFilename: image.name,
    imageFrames: image.shape.frames,
    imageHeight: image.shape.height,
    imageId: image.id,
    imagePlanes: image.shape.planes,
    imageWidth: image.shape.width,
  };

  return image.annotations.map((annotation: AnnotationType) => {
    const index = state.present.categories.findIndex(
      (category: CategoryType) => {
        return category.id === annotation.categoryId;
      }
    );

    const category = state.present.categories[index];

    return {
      ...columns,
      annotationBoundingBoxHeight: annotation.boundingBox[3],
      annotationBoundingBoxWidth: annotation.boundingBox[2],
      annotationBoundingBoxX: annotation.boundingBox[0],
      annotationBoundingBoxY: annotation.boundingBox[1],
      annotationCategoryId: category.id,
      annotationCategoryName: category.name,
      annotationId: annotation.id,
      annotationMask: annotation.mask.join(" "),
    };
  });
};
