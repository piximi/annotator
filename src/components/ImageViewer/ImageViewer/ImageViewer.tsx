import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { ImageType } from "../../../types/ImageType";
import { useDispatch, useSelector } from "react-redux";
import { CategoriesList } from "../CategoriesList";
import { ToolOptions } from "../ToolOptions";
import { Tools } from "../Tools";
import {
  addImages,
  applicationSlice,
  setActiveImage,
  setChannels,
  setOperation,
  setSelectedAnnotation,
  setSelectedAnnotations,
} from "../../../store";
import { Content } from "../Content";
import { ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
import { theme } from "./theme";
import * as ImageJS from "image-js";
import { ShapeType } from "../../../types/ShapeType";
import { loadLayersModelThunk } from "../../../store/thunks";
import { ChannelType } from "../../../types/ChannelType";
import { ToolType } from "../../../types/ToolType";
import { v4 } from "uuid";
import { imagesSelector } from "../../../store/selectors/imagesSelector";
import { replaceDuplicateName } from "../../../image/imageHelper";

type ImageViewerProps = {
  image?: ImageType;
};

export const ImageViewer = (props: ImageViewerProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const path =
      "https://raw.githubusercontent.com/zaidalyafeai/HostedModels/master/unet-128/model.json";

    dispatch(loadLayersModelThunk({ name: "foo", path: path }));
  });

  useEffect(() => {
    if (props.image) {
      dispatch(
        applicationSlice.actions.setActiveImage({ image: props.image.id })
      );
    }
  }, [dispatch, props.image]);

  const images = useSelector(imagesSelector);

  const classes = useStyles();

  const [, setDropped] = useState<File[]>([]);

  const onDrop = useCallback(
    (item) => {
      if (item) {
        for (let i = 0; i < item.files.length; i++) {
          const file = item.files[i];

          file.arrayBuffer().then((buffer: any) => {
            ImageJS.Image.load(buffer).then((image) => {
              const shape: ShapeType = {
                channels: image.components,
                frames: 1,
                height: image.height,
                planes: 1,
                width: image.width,
              };

              const imageDataURL = image.toDataURL("image/png", {
                useCanvas: true,
              });

              const loaded: ImageType = {
                avatar: image
                  .resize({ width: 50 })
                  .toDataURL("image/png", { useCanvas: true }),
                id: v4(),
                annotations: [],
                name: file.name,
                shape: shape,
                originalSrc: imageDataURL,
                src: imageDataURL,
              };

              console.error(
                images.map((image: ImageType) => {
                  return image.name.split(".")[0];
                })
              );

              dispatch(addImages({ newImages: [loaded] }));

              if (i === 0) {
                dispatch(
                  setActiveImage({
                    image: loaded.id,
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

                let channels: Array<ChannelType> = []; //number of channels depends if image is greyscale or RGB
                for (let i = 0; i < image.components; i++) {
                  channels.push({ visible: true, range: [0, 255] });
                }
                dispatch(setChannels({ channels: channels }));

                dispatch(
                  setOperation({ operation: ToolType.RectangularAnnotation })
                );
              }
            });
          });
        }
      }
    },
    [setDropped]
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />

        <CategoriesList />

        <Content onDrop={onDrop} />

        <ToolOptions />

        <Tools />
      </div>
    </ThemeProvider>
  );
};
