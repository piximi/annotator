import Dialog from "@material-ui/core/Dialog";
import React from "react";
import { ShapeType } from "../../../../types/ShapeType";
import {
  applicationSlice,
  setActiveImage,
  setChannels,
  setImages,
  setOperation,
  setSelectedAnnotation,
  setSelectedAnnotations,
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
import * as malariaAnnotations from "../../../../images/malaria.json";
import * as cellpaintingAnnotations from "../../../../images/cellpainting.json";
import { AnnotationType } from "../../../../types/AnnotationType";
import { SerializedAnnotationType } from "../../../../types/SerializedAnnotationType";
import { CategoryType } from "../../../../types/CategoryType";
import { categoriesSelector } from "../../../../store/selectors";
import { importSerializedAnnotations } from "../../../../image/imageHelper";

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

  const examples = [
    {
      name: "malaria.png",
      description:
        "Blood cells infected by malaria and stained with Giemsa reagent. Image from the Broad Bioimage Benchmark Collection, image set BBBC041v1.",
      data: malaria,
      project: (malariaAnnotations as any).default,
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
      project: (cellpaintingAnnotations as any).default,
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
    project,
  }: {
    data: any;
    description: string;
    name: string;
    project: any;
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

    let updatedCategories: Array<CategoryType> = categories_in;

    project[0].annotations.forEach(
      (serializedAnnotation: SerializedAnnotationType) => {
        const { annotation_out, categories } = importSerializedAnnotations(
          serializedAnnotation,
          updatedCategories
        );

        updatedCategories = categories;

        newAnnotations.push(annotation_out);
      }
    );

    dispatch(
      applicationSlice.actions.setImageInstances({ instances: newAnnotations })
    );
    dispatch(
      applicationSlice.actions.setCategories({ categories: updatedCategories })
    );
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
