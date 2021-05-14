import React, { useEffect, useState } from "react";
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
import { IntensityRescalingSlider } from "../IntensityRescalingSlider/IntensityRescalingSlider";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";
import { ChannelType } from "../../../../types/ChannelType";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const channels = useSelector(channelsSelector);

  const [prevChannels, setPrevChannels] = useState<Array<ChannelType>>([]); //used to keep track of which channel was changed

  const [image, setImage] = useState<ImageJS.Image>();

  const [origImage, setOrigImage] = useState<ImageJS.Image>();

  useEffect(() => {
    if (!originalSrc) return;

    ImageJS.Image.load(originalSrc).then((imageIn) => {
      setOrigImage(imageIn);

      const newImage = ImageJS.Image.createFrom(imageIn, {
        data: Uint8Array.from(imageIn.data),
      });
      setPrevChannels(channels);
      setImage(newImage);
      // Todo: Reset channel variables
    });
  }, [originalSrc]);

  useEffect(() => {
    if (!origImage || !image) return;
    const changedChannel = changedChannelIndex();
    if (changedChannel === undefined || changedChannel === -1) return;
    if (!image) return;
    applyScaling(changedChannel);

    setPrevChannels(channels);
  }, [channels]);

  /*
   * Find out the channel index that was changed by the slider to avoid rescaling al channels
   * */
  const changedChannelIndex = () => {
    const visibles = channels.map((channel: ChannelType) => channel.visible);
    const ranges = channels.map((channel: ChannelType) => channel.range);
    const changedChannels = prevChannels.map(
      (prevChannel: ChannelType, idx: number) => {
        if (
          prevChannel.range[0] !== ranges[idx][0] ||
          prevChannel.range[1] !== ranges[idx][1] ||
          prevChannel.visible !== visibles[idx]
        ) {
          return idx;
        } else return -1;
      }
    );
    return changedChannels.find((index: number) => {
      return index !== -1;
    });
  };

  const scaleIntensity = (range: Array<number>, pixel: number) => {
    if (pixel < range[0]) return 0;
    if (pixel >= range[1]) return 255;
    return 255 * ((pixel - range[0]) / (range[1] - range[0]));
  };

  const applyScaling = (channelIndex: number) => {
    const channelTgt = channels[channelIndex];
    // @ts-ignore
    const rawData = origImage.getChannel(channelIndex);
    if (!channelTgt.visible) {
      rawData.data = new Uint8Array(rawData.data.length);
    } else {
      for (let i = 0; i < rawData.data.length; i++) {
        let pix = rawData.data[i];
        rawData.setPixel(i, [scaleIntensity(channelTgt.range, pix)]);
      }
    }
    // @ts-ignore
    image.setChannel(channelIndex, rawData);
    dispatch(
      applicationSlice.actions.setImageSrc({
        src: image!.toDataURL("image-png", { useCanvas: true }),
      })
    );
  };

  const [values, setValues] = React.useState<Array<Array<number>>>([
    [0, 255],
    [0, 255],
    [0, 255],
  ]);

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
    setImage(
      ImageJS.Image.createFrom(origImage!, {
        data: Uint8Array.from(origImage!.data),
      })
    );
    setPrevChannels(channels);
    setValues(channels.map((channel: ChannelType) => channel.range));
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Color adjustment tool")} />

      <Divider />

      <IntensityRescalingSlider intensityRanges={values} />

      <List dense>
        <ListItem button onClick={onResetChannelsClick}>
          <ListItemText>{t("Reset")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
