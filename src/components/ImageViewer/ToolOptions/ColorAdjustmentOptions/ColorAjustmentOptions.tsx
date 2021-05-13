import React, { useLayoutEffect, useRef } from "react";
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
import { IntensitySlider } from "../ContrastSliders/IntensitySlider";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const firstUpdate = useRef(true);

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const channels = useSelector(channelsSelector);

  const scaleIntensity = (range: Array<number>, pixel: number) => {
    return (pixel / 255) * (range[1] - range[0]) + range[0];
  };

  const mapIntensities = () => {
    if (!originalSrc) return;
    ImageJS.Image.load(originalSrc).then((image) => {
      const delta = image.alpha ? image.components + 1 : image.components;

      let newData: Array<number> = [];

      for (let i = 0; i < image.data.length; i += delta) {
        newData.push(
          channels[0].visible
            ? scaleIntensity(channels[0].range, image.data[i])
            : 0
        );
        newData.push(
          channels[1].visible
            ? scaleIntensity(channels[1].range, image.data[i + 1])
            : 0
        );
        newData.push(
          channels[2].visible
            ? scaleIntensity(channels[2].range, image.data[i + 2])
            : 0
        );
        if (image.alpha) {
          newData.push(image.data[i + image.components]);
        }
      }
      const newImage = new ImageJS.Image(image.width, image.height, newData, {
        components: image.components,
        alpha: image.alpha,
      });

      dispatch(
        applicationSlice.actions.setImageSrc({
          src: newImage.toDataURL("image-png", { useCanvas: true }),
        })
      );
    });
  };

  useLayoutEffect(() => {
    //layout effect is used to prevent unnecessary rerendering on first render
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    mapIntensities();
  }, [channels, originalSrc]);

  const [values, setValues] = React.useState<Array<Array<number>>>([
    [0, 255],
    [0, 255],
    [0, 255],
  ]);

  const updateValues = (values: Array<Array<number>>) => {
    setValues(values);
  };

  const onResetChannelsClick = () => {
    dispatch(
      applicationSlice.actions.setChannels({
        channels: [
          {
            range: [0, 255],
            visible: true,
          },
          {
            range: [0, 255],
            visible: true,
          },
          {
            range: [0, 255],
            visible: true,
          },
        ],
      })
    );
    setValues([
      [0, 255],
      [0, 255],
      [0, 255],
    ]); //reflect change in the slider values
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Color adjustment tool")} />

      <Divider />

      <IntensitySlider values={values} updateValues={updateValues} />

      <List dense>
        <ListItem button onClick={onResetChannelsClick}>
          <ListItemText>{t("Reset intensities range")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
