import React, { useCallback, useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import { ImageType } from "../../../types/ImageType";
import { useDispatch } from "react-redux";
import { ImageViewerAppBar } from "../ImageViewerAppBar";
import { CategoriesList } from "../CategoriesList";
import { ToolOptions } from "../ToolOptions";
import { Tools } from "../Tools";
import { echoThunk, setImage, applicationSlice } from "../../../store";
import { Content } from "../Content";
import { ThemeProvider } from "@material-ui/core/styles";
import { useStyles } from "./ImageViewer.css";
import { theme } from "./theme";
import * as ImageJS from "image-js";
import { ShapeType } from "../../../types/ShapeType";
import { loadLayersModelThunk } from "../../../store/thunks";
import { ExampleContent } from "../ExampleContent/ExampleContent";

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
              channels: 4,
              frames: 1,
              height: image.height,
              planes: 1,
              width: image.width,
            };

            dispatch(
              setImage({
                image: {
                  id: "",
                  annotations: [],
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

        <ExampleContent />

        <ToolOptions />

        <Tools />
      </div>
    </ThemeProvider>
  );
};
