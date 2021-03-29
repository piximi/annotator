import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { Image } from "../../../types/Image";
import { useDispatch } from "react-redux";
import { ImageViewerAppBar } from "../ImageViewerAppBar";
import { CategoriesList } from "../CategoriesList";
import { ToolOptions } from "../ToolOptions";
import { Tools } from "../Tools";
import { echoThunk, setImage, slice } from "../../../store";
import { Content } from "../Content";
import { ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
import { theme } from "./theme";
import * as ImageJS from "image-js";
import { Shape } from "../../../types/Shape";
import { loadLayersModelThunk } from "../../../store/thunks";

type ImageViewerProps = {
  image?: Image;
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
      dispatch(slice.actions.setImage({ image: props.image }));
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

            const shape: Shape = {
              r: image.height,
              c: image.width,
              channels: 4,
            };

            dispatch(
              setImage({
                image: {
                  id: "",
                  instances: [],
                  name: name,
                  shape: shape,
                  src: image.toDataURL(),
                },
              })
            );
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

        <ImageViewerAppBar />

        <CategoriesList />

        <Content onDrop={onDrop} />

        <ToolOptions />

        <Tools />
      </div>
    </ThemeProvider>
  );
};
