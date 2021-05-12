import React from "react";
import { InformationBox } from "../InformationBox";
import Divider from "@material-ui/core/Divider";
import { useTranslation } from "../../../../hooks/useTranslation";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useDispatch, useSelector } from "react-redux";
import { applicationSlice } from "../../../../store/slices";
import { imageOriginalSrcSelector } from "../../../../store/selectors";
import * as ImageJS from "image-js";
import { scaleIntensities } from "../../../../image/imageHelper";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const onContrastAdjustmentClick = () => {
    if (!originalSrc) return;
    ImageJS.Image.load(originalSrc).then((image) => {
      console.info("Here");
      console.info(image.data);
      console.info(image.width);
      console.info(image.components);
      console.info(image.alpha);

      const red: Array<number> = [];
      const green: Array<number> = [];
      const blue: Array<number> = [];
      //for now let's assume selected channel is red
      const delta = image.alpha ? 4 : 3;
      console.info(delta);
      for (let i = 0; i < image.data.length; i += delta) {
        red.push(image.data[i]);
      }
      for (let j = 1; j < image.data.length; j += delta) {
        green.push(image.data[j]);
      }
      for (let k = 2; k < image.data.length; k += delta) {
        blue.push(image.data[k]);
      }
      const newRed = scaleIntensities({ min: 0, max: 0 }, red);
      const newGreen = scaleIntensities({ min: 0, max: 0 }, green);
      const newBlue = scaleIntensities({ min: 0, max: 255 }, blue);

      const newData: Array<number> = [];
      newRed.forEach((el: number, index: number) => {
        newData.push(el);
        newData.push(newGreen[index]);
        newData.push(newBlue[index]);
      });
      const newImage = new ImageJS.Image(image.width, image.height, newData, {
        components: image.components,
        alpha: image.alpha,
      });
      dispatch(
        applicationSlice.actions.setImageSrc({ src: newImage.toDataURL() })
      );
    });
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Hand tool")} />

      <Divider />

      <List dense>
        <ListItem button onClick={onContrastAdjustmentClick}>
          <ListItemText>{t("Change contrast")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
