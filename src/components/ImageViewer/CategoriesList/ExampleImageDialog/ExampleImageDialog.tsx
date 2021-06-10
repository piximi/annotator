import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { ShapeType } from "../../../../types/ShapeType";
import {
  setActiveImage,
  setOperation,
  setSelectedAnnotations,
  setSelectedAnnotation,
  setChannels,
  setImages,
  applicationSlice,
} from "../../../../store";
import { useDispatch, useSelector } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import malaria from "../../../../images/malaria.png";
import cellpainting from "../../../../images/cell-painting.png";
import { ChannelType } from "../../../../types/ChannelType";
import { ToolType } from "../../../../types/ToolType";
import { ImageType } from "../../../../types/ImageType";
import { v4 } from "uuid";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { SerializedFileType } from "../../../../types/SerializedFileType";
import * as cellpaintingAnnotations from "../../../../images/example.png-7.json";
import { AnnotationType } from "../../../../types/AnnotationType";
import { SerializedAnnotationType } from "../../../../types/SerializedAnnotationType";
import { CategoryType } from "../../../../types/CategoryType";
import {
  categoriesSelector,
  imageInstancesSelector,
} from "../../../../store/selectors";
import { importSerializedAnnotations } from "../../../../image/imageHelper";
import { decode, encode } from "../../../../image/rle";
import * as ImageJS from "image-js";

type ExampleImageDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const ExampleImageDialog = ({
  onClose,
  open,
}: ExampleImageDialogProps) => {
  const dispatch = useDispatch();

  const images = useSelector(imagesSelector);

  const categories_in = useSelector(categoriesSelector);

  const annotations = useSelector(imageInstancesSelector);

  const examples = [
    {
      name: "malaria.png",
      description:
        "Blood cells infected by malaria and stained with Giemsa reagent. Image from the Broad Bioimage Benchmark Collection, image set BBBC041v1.",
      data: malaria,
      shape: {
        channels: 3,
        frames: 1,
        height: 1200,
        planes: 1,
        width: 1600,
      },
    },
    {
      name: "cell-painting.png",
      description:
        "Help: can someome provide a one sentence description for this image?",
      data: cellpainting,
      shape: {
        channels: 3,
        frames: 1,
        height: 512,
        planes: 1,
        width: 512,
      },
    },
  ];

  const onClick = ({
    data,
    description,
    name,
    shape,
  }: {
    data: any;
    description: string;
    name: string;
    shape: ShapeType;
  }) => {
    onClose();

    const example: ImageType = {
      avatar: data as string,
      id: v4(),
      annotations: [],
      name: name,
      shape: shape,
      originalSrc: data as string,
      src: data as string,
    };

    dispatch(setImages({ images: [...images, example] }));

    dispatch(
      setActiveImage({
        image: example.id,
      })
    );

    dispatch(
      setSelectedAnnotations({
        selectedAnnotations: [],
      })
    );

    dispatch(
      setSelectedAnnotation({
        selectedAnnotation: undefined,
      })
    );

    let channels: Array<ChannelType> = [];
    for (let i = 0; i < shape.channels; i++) {
      channels.push({ visible: true, range: [0, 255] });
    }
    dispatch(setChannels({ channels }));

    dispatch(setOperation({ operation: ToolType.RectangularAnnotation }));

    const newAnnotations: Array<AnnotationType> = [];

    let newCategories: Array<CategoryType> = [];

    console.info(cellpaintingAnnotations);
    const foo = (cellpaintingAnnotations as any).default;
    //FIXME This is temporary code to convert the way we prevously saved annotations to the way we want them now
    foo.forEach((el: any, index: number) => {
      console.info(el);
      const serializedAnnoation: SerializedAnnotationType = {
        annotationBoundingBoxHeight: el.annotationBoundingBoxHeight,
        annotationBoundingBoxWidth: el.annotationBoundingBoxWidth,
        annotationBoundingBoxX: el.annotationBoundingBoxX,
        annotationBoundingBoxY: el.annotationBoundingBoxY,
        annotationCategoryColor: el.annotationCategoryColor,
        annotationCategoryId: el.annotationCategoryId,
        annotationCategoryName: el.annotationCategoryName,
        annotationId: el.annotationId,
        annotationMask: el.annotationMask,
      };

      const { annotation_out, categories } = importSerializedAnnotations(
        serializedAnnoation,
        categories_in
      );

      newCategories = categories;

      //the issue we have is that the mask of the annotation corresponds to the whoel size image
      // we are going to have to crop it to the bounding box because that is what the rendereing function expects
      // then encode the image again before setting iamge instances

      const mask = annotation_out.mask;
      const fullImage = new ImageJS.Image(
        shape.width,
        shape.height,
        decode(mask),
        { components: 1, alpha: 0 }
      );

      const boundingBox = annotation_out.boundingBox;

      const endX = Math.min(shape.width, boundingBox[2]);
      const endY = Math.min(shape.height, boundingBox[3]);

      //extract bounding box params
      const boxWidth = endX - boundingBox[0];
      const boxHeight = endY - boundingBox[1];
      const boxX = Math.max(0, boundingBox[0]);
      const boxY = Math.max(0, boundingBox[1]);

      const croppedImage = fullImage.crop({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
      });

      const croppedMask = encode(Uint8Array.from(croppedImage.data));

      const convertedAnnotation: AnnotationType = {
        ...annotation_out,
        mask: croppedMask,
      };

      if (index === 0) {
        debugger;
      }

      newAnnotations.push(convertedAnnotation);
    });

    dispatch(
      applicationSlice.actions.setImageInstances({ instances: newAnnotations })
    );
    dispatch(
      applicationSlice.actions.setCategories({ categories: newCategories })
    );

    //PSEUDOCODE
    //1: Open json file
    //2: iterate through array
    //3 import the serialized annotation as AnnotationType
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <List component="div" role="list">
        {examples.map((example, index) => {
          return (
            <ListItem
              button
              divider
              key={index}
              role="listitem"
              onClick={() => onClick(example)}
            >
              <ListItemText
                primary={example.name}
                secondary={example.description}
              />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};
