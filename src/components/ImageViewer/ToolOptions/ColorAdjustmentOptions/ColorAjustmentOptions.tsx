import React, { useEffect } from "react";
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
import { SampleList } from "../SampleList";
import { ContrastSliders } from "../ContrastSliders/ContrastSliders";
import { intensityRangeSelector } from "../../../../store/selectors/intensityRangeSelector";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const intensityRange = useSelector(intensityRangeSelector);

  const onContrastAdjustmentClick = () => {
    if (!originalSrc) return;
    ImageJS.Image.load(originalSrc).then((image) => {
      const red: Array<number> = [];
      const green: Array<number> = [];
      const blue: Array<number> = [];
      //for now let's go through all the channels, but later it's only going to be the selected channels
      const delta = image.alpha ? 4 : 3;
      for (let i = 0; i < image.data.length; i += delta) {
        red.push(image.data[i]);
      }
      for (let j = 1; j < image.data.length; j += delta) {
        green.push(image.data[j]);
      }
      for (let k = 2; k < image.data.length; k += delta) {
        blue.push(image.data[k]);
      }
      const newRed = scaleIntensities(intensityRange[0], red);
      const newGreen = scaleIntensities(intensityRange[1], green);
      const newBlue = scaleIntensities(intensityRange[2], blue);

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

      <ContrastSliders />

      <List dense>
        <ListItem button onClick={onContrastAdjustmentClick}>
          <ListItemText>{t("Click to adjust")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
