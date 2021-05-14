import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { ImageType } from "../../../types/ImageType";
import { useDispatch } from "react-redux";
import { CategoriesList } from "../CategoriesList";
import { ToolOptions } from "../ToolOptions";
import { Tools } from "../Tools";
import {
  applicationSlice,
  setChannels,
  setContrast,
  setImage,
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
import { TooltipCard } from "../Tools/Tool/Tool";
import { ChannelType } from "../../../types/ChannelType";

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
      dispatch(applicationSlice.actions.setImage({ image: props.image }));
    }
  }, [dispatch, props.image]);

  const classes = useStyles();

  const [, setDropped] = useState<File[]>([]);

  const onDrop = useCallback(
    (item) => {
      if (item) {
        const file = item.files[0];

        const reader = new FileReader();

        reader.onload = async (event: ProgressEvent<FileReader>) => {};

        file.arrayBuffer().then((buffer: any) => {
          ImageJS.Image.load(buffer).then((image) => {
            const name = file.name;

            const shape: ShapeType = {
              channels: image.components,
              frames: 1,
              height: image.height,
              planes: 1,
              width: image.width,
            };

            console.info("Line 71");
            dispatch(
              setImage({
                image: {
                  id: "",
                  annotations: [],
                  name: name,
                  shape: shape,
                  originalSrc: image.toDataURL(),
                  src: image.toDataURL(),
                },
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
            dispatch(setChannels({ channels }));
          });
        });

        reader.readAsDataURL(file);
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
