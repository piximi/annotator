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
import { ColorAdjustmentSliders } from "../ColorAdjustmentSliders/ColorAdjustmentSliders";
import { channelsSelector } from "../../../../store/selectors/intensityRangeSelector";
import { ChannelType } from "../../../../types/ChannelType";
import { imageShapeSelector } from "../../../../store/selectors/imageShapeSelector";

export const ColorAdjustmentOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const originalSrc = useSelector(imageOriginalSrcSelector);

  const imageShape = useSelector(imageShapeSelector);

  const channels = useSelector(channelsSelector);

  const [prevChannels, setPrevChannels] = useState<Array<ChannelType>>([]); //used to keep track of which channel was changed

  const [image, setImage] = useState<ImageJS.Image>();

  const [origImage, setOrigImage] = useState<ImageJS.Image>();

  const [displayedValues, setDisplayedValues] = useState<Array<Array<number>>>(
    channels.map((channel: ChannelType) => [...channel.range])
  ); //we keep that state variable here and pass it to slider so that visible slider ranges can change accordingly

  const setDefaultChannels = (components: number) => {
    const defaultChannels: Array<ChannelType> = []; //number of channels depends on whether image is greyscale or RGB
    for (let i = 0; i < components; i++) {
      defaultChannels.push({
        range: [0, 255],
        visible: true,
      });
    }
    return defaultChannels;
  };

  useEffect(() => {
    if (!originalSrc) return;

    if (!imageShape) return;

    const defaultChannels = setDefaultChannels(imageShape.channels);

    ImageJS.Image.load(originalSrc).then((imageIn) => {
      setOrigImage(imageIn);

      const newImage = ImageJS.Image.createFrom(imageIn, {
        data: Uint8Array.from(imageIn.data),
      });
      setImage(newImage);
    });
    dispatch(
      applicationSlice.actions.setChannels({
        channels: defaultChannels,
      })
    );
    setPrevChannels(defaultChannels);
    setDisplayedValues(
      defaultChannels.map((channel: ChannelType) => [...channel.range])
    );
  }, [originalSrc]);

  useEffect(() => {
    if (!origImage || !image) return;
    const changedChannel = changedChannelIndex();
    if (changedChannel === undefined || changedChannel === -1) return;
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
        src: image!.toDataURL("image/png", { useCanvas: true }),
      })
    );
  };

  const onResetChannelsClick = () => {
    if (!imageShape) return;
    const defaultChannels = setDefaultChannels(imageShape.channels);
    dispatch(
      applicationSlice.actions.setChannels({
        channels: defaultChannels,
      })
    );
    setImage(
      ImageJS.Image.createFrom(origImage!, {
        data: Uint8Array.from(origImage!.data),
      })
    );
    setPrevChannels(channels);
    setDisplayedValues(
      defaultChannels.map((channel: ChannelType) => [...channel.range])
    );
  };

  const updateDisplayedValues = (values: Array<Array<number>>) => {
    setDisplayedValues(values);
  };

  return (
    <React.Fragment>
      <InformationBox description="…" name={t("Color adjustment tool")} />

      <Divider />

      <ColorAdjustmentSliders
        displayedValues={displayedValues}
        updateDisplayedValues={updateDisplayedValues}
      />

      <List dense>
        <ListItem button onClick={onResetChannelsClick}>
          <ListItemText>{t("Reset")}</ListItemText>
        </ListItem>
      </List>
    </React.Fragment>
  );
};
