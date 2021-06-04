import React from "react";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector } from "react-redux";
import { imageHeightSelector } from "../../../../store/selectors/imageHeightSelector";
import { imageWidthSelector } from "../../../../store/selectors/imageWidthSelector";
import { imageInstancesSelector } from "../../../../store/selectors";
import { decode } from "../../../../image/rle";
import * as ImageJS from "image-js";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { ImageType } from "../../../../types/ImageType";
import { AnnotationType } from "../../../../types/AnnotationType";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const SaveProjectMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const imageHeight = useSelector(imageHeightSelector);
  const imageWidth = useSelector(imageWidthSelector);
  const annotations = useSelector(imageInstancesSelector);
  const images = useSelector(imagesSelector);

  const onExport = () => {
    if (!imageWidth || !imageHeight) return;
    if (!annotations) return;

    images.forEach((image: ImageType) => {
      image.annotations.forEach((annotation: AnnotationType) => {
        const encoded = annotation.mask;

        const decoded = decode(encoded);

        const mask = new ImageJS.Image(imageWidth, imageHeight, decoded, {
          components: 1,
          alpha: 0,
        });

        const uri = mask.toDataURL("image/png", {
          useCanvas: true,
        });

        //draw to canvas
        const canvas = document.createElement("canvas");
        canvas.width = imageWidth;
        canvas.height = imageHeight;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        //create image from Data URL
        const image = new Image(imageWidth, imageHeight);
        image.onload = () => {
          ctx.drawImage(image, 0, 0, imageWidth, imageHeight);
          canvas.toBlob((blob) => {
            if (!blob) return;
            saveAs(blob, "test.png");
          }, "image/png");
        };
        image.crossOrigin = "anonymous";
        image.src = uri;
      });
    });
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Save project file" />
    </MenuItem>
  );
};
