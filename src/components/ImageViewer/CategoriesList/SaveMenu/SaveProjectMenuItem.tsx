import React from "react";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import { useSelector } from "react-redux";
import { imageHeightSelector } from "../../../../store/selectors/imageHeightSelector";
import { imageWidthSelector } from "../../../../store/selectors/imageWidthSelector";
import * as uuid from "uuid";
import {
  categoriesSelector,
  imageInstancesSelector,
} from "../../../../store/selectors";
import { decode } from "../../../../image/rle";
import * as ImageJS from "image-js";
import { imagesSelector } from "../../../../store/selectors/imagesSelector";
import { ImageType } from "../../../../types/ImageType";
import { AnnotationType } from "../../../../types/AnnotationType";
import JSZip from "jszip";
import { CategoryType } from "../../../../types/CategoryType";
import { saveAs } from "file-saver";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
};

export const SaveProjectMenuItem = ({
  popupState,
}: SaveAnnotationsMenuItemProps) => {
  const annotations = useSelector(imageInstancesSelector);
  const images = useSelector(imagesSelector);
  const categories = useSelector(categoriesSelector);

  const onExport = () => {
    if (!annotations) return;

    let zip = new JSZip();

    const loopOverImages = () => {
      return new Promise((resolve, reject) => {
        images.forEach((current: ImageType) => {
          current.annotations.forEach((annotation: AnnotationType) => {
            const encoded = annotation.mask;

            const decoded = decode(encoded);

            const mask = new ImageJS.Image(
              current.shape.width,
              current.shape.height,
              decoded,
              {
                components: 1,
                alpha: 0,
              }
            );

            const uri = mask.toDataURL("image/png", {
              useCanvas: true,
            });

            //draw to canvas
            const canvas = document.createElement("canvas");
            canvas.width = current.shape.width;
            canvas.height = current.shape.height;

            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            const categoryName = categories.filter((category: CategoryType) => {
              return category.id === annotation.categoryId;
            })[0].name;

            zip.folder(`${categoryName}/${current.name}`);
            const name = uuid.v4();

            //create image from Data URL
            const image = new Image(current.shape.width, current.shape.height);
            image.onload = () => {
              ctx.drawImage(
                image,
                0,
                0,
                current.shape.width,
                current.shape.height
              );
              canvas.toBlob((blob) => {
                if (!blob) return;

                console.info("Saving image in zip");
                zip.file(`${categoryName}/${current.name}/${name}.png`, blob, {
                  base64: true,
                });
              }, "image/png");
            };
            image.crossOrigin = "anonymous";
            image.src = uri;
          });
        });
      });
    };

    loopOverImages().then(() => {
      zip.generateAsync({ type: "blob" }).then((blob) => {
        console.info("Saving zip file");
        saveAs(blob, "project.zip");
      });
    });
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Save project file" />
    </MenuItem>
  );
};
