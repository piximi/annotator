import React, { useRef, useState } from "react";
import { useStyles } from "../ImageDialogCanvas/ImageDialogCanvas.css";
import { Image as ImageType } from "../../types/Image";
import { useSelector } from "react-redux";
import { imagesSelector, selectedImagesSelector } from "../../store/selectors";

export const BackgroundCanvas = () => {
  const classes = useStyles();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useSelector(imagesSelector);
  const selectedImages: Array<string> = useSelector(selectedImagesSelector);
  const [counter, setCounter] = React.useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedImages[counter]
  );

  const heightRef = useRef<number>(300);
  const widthRef = useRef<number>(300);
  //const [aspectRatio, setAspectRatio] = React.useState<number>(1);

  React.useEffect(() => {
    // TODO: Ability to move between selected images
    // const nextImage = selectedImages.find(
    //   (image) => image === selectedImages[counter]
    // );
    // if (nextImage) {
    //   setSelectedImage(nextImage);
    // }
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const background = new Image();
      // const index = images.findIndex(
      //   (image: ImageType) => image.id === selectedImage
      // );
      //background.src = images[index].src;
      background.src = images[0].src;
      background.onload = () => {
        if (context) {
          heightRef.current = background.height;
          widthRef.current = background.width;
          context.drawImage(background, 0, 0);
        }
      };
    }
  }, [selectedImages, selectedImage, selectedImages, counter]);
  return (
    <canvas
      style={{ height: heightRef.current, width: widthRef.current }}
      className={classes.backgroundCanvas}
      ref={canvasRef}
    />
  );
};
