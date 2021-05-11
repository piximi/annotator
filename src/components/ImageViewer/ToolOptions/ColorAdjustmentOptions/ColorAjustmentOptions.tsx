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

      //TODO: extract each channel using image.components. Should have a flat array of size N*M. Feed the channel data to imageHelper.adjustContrast and get a flat channel back
      //make a new data array with these three transformed channels
      //make a new ImageJS image, get its data with toDataURL, and do a dispatch that will update displayed string.
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
